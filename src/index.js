export const name = 'store';

export * as actions from './actions.js';

export const started = function () {
  this.registers = {};
};
