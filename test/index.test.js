/* eslint-disable */

import { resolve } from 'path';
import { createBroker, FileCursor } from '@rugo-vn/service';
import { assert, expect } from 'chai';
import rimraf from 'rimraf';

const DEFAULT_DRIVE = {
  spaceId: 'demo',
  driveName: 'foo',
};

describe('store test', () => {
  const root = resolve('.tmp');

  let broker;

  before(async () => {
    rimraf.sync(root);

    // create broker
    broker = createBroker({
      _services: [
        './src/index.js',
      ],
      storage: root,
    });

    await broker.loadServices();
    await broker.start();

    await broker.call(`storage.setConfig`, { ...DEFAULT_DRIVE, config: {} });
  });

  after(async () => {
    await broker.close();
    rimraf.sync(root);
  });

  it('should create a file', async () => {
    const res = await broker.call(`storage.create`, { ...DEFAULT_DRIVE, path: 'hi.txt' });
    expect(res).to.has.property('name', 'hi.txt');

    const res2 = await broker.call(`storage.create`, { ...DEFAULT_DRIVE, path: 'ho.txt', data: FileCursor(resolve('./package.json')) });
    expect(await res2.data.toText().indexOf('version')).to.be.not.eq(-1);
  });

  it('should list entries', async () => {
    const res = await broker.call(`storage.list`, { ...DEFAULT_DRIVE, path: '.' });
    expect(res).to.has.property('length', 2);
  });

  it('should compress and extract a directory', async () => {
    const res = await broker.call(`storage.compress`, { ...DEFAULT_DRIVE, from: 'ho.txt' });
    expect(res).to.has.property('path', '/ho.zip');

    const res2 = await broker.call(`storage.extract`, { ...DEFAULT_DRIVE, from: 'ho.zip' });
    expect(res2).to.has.property('path', '/ho');

    const res3 = await broker.call(`storage.compress`, { ...DEFAULT_DRIVE, from: 'ho', to: 'bar/bar.zip' });
    expect(res3).to.has.property('path', '/bar/bar.zip');

    const res4 = await broker.call(`storage.extract`, { ...DEFAULT_DRIVE, from: 'bar/bar.zip', to: 'ho2' });
    expect(res4).to.has.property('path', '/ho2');
  });

  it('should move entries', async () => {
    const res = await broker.call(`storage.move`, { ...DEFAULT_DRIVE, from: 'bar/bar.zip', to: 'gao.zip' });
    expect(res).to.has.property('path', '/gao.zip');

    const res2 = await broker.call(`storage.move`, { ...DEFAULT_DRIVE, from: 'ho2/ho', to: 'bar/hoho' });
    expect(res2).to.has.property('path', '/bar/hoho');

    const res3 = await broker.call(`storage.move`, { ...DEFAULT_DRIVE, from: 'ho.zip', to: 'bar/hoho.zip' });
    expect(res3).to.has.property('path', '/bar/hoho.zip');

    try {
      await broker.call(`storage.move`, { ...DEFAULT_DRIVE, from: 'bar', to: 'bar/hoho/boo' });
    } catch(err) {
      expect(err).to.has.property('message', 'Cannot move parent to child');
    }
  });

  it('should delete an entry', async () => {
    const res = await broker.call(`storage.remove`, { ...DEFAULT_DRIVE, path: 'hi.txt' });
    expect(res).to.has.property('name', 'hi.txt');

    const res2 = await broker.call(`storage.list`, { ...DEFAULT_DRIVE, path: '.' });
    expect(res2).to.has.property('length', 5);
  });
});