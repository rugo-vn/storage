import { existsSync, mkdirSync } from 'fs';
import { RugoException } from '@rugo-vn/exception';
import { path } from 'ramda';

export const name = 'storage';

export * as actions from './actions.js';
export * as hooks from './hooks.js';
export * as methods from './methods.js';

export const started = function () {
  this.storage = path(['settings', 'storage'], this);

  if (!this.storage) {
    throw new RugoException('Storage settings was not defined.');
  }

  if (!existsSync(this.storage)) {
    mkdirSync(this.storage);
  }

  this.registers = {};
};
