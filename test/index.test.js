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

  it('should delete an entry', async () => {
    const res = await broker.call(`storage.remove`, { ...DEFAULT_DRIVE, path: 'hi.txt' });
    expect(res).to.has.property('name', 'hi.txt');

    const res2 = await broker.call(`storage.list`, { ...DEFAULT_DRIVE, path: '.' });
    expect(res2).to.has.property('length', 1);
  });
});