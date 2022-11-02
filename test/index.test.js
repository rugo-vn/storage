/* eslint-disable */

import { createBroker } from '@rugo-vn/service';
import { assert, expect } from 'chai';

describe('store test', () => {
  let broker;

  before(async () => {
    // create broker
    broker = createBroker({
      _services: [
        './src/index.js',
      ],
    });

    await broker.loadServices();
    await broker.start();
  });

  after(async () => {
    await broker.close();
  });

  it('should put and get', async () => {
    const res = await broker.call('store.put', { key: 'foo', value: 'bar' });
    expect(res).to.be.eq(true);

    const val = await broker.call('store.get', { key: 'foo' });
    expect(val).to.be.eq('bar');

    const noval = await broker.call('store.get', { key: 'nokey' });
    expect(noval).to.be.eq(undefined);
  });
});