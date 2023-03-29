import { RugoException } from '@rugo-vn/exception';
import { join } from 'path';

import * as actions from './actions.js';
import { NOT_REQURIED_CONFIG } from './constants.js';

export const before = {
  async all(args) {
    const { spaceId, driveName } = args;

    if (!spaceId || !driveName) {
      throw new RugoException('spaceId and driveName is required');
    }

    args.root = join(this.storage, spaceId, driveName);
  },
};

for (let name in actions) {
  before[name] ||= [];
  if (NOT_REQURIED_CONFIG.indexOf(name) === -1)
    before[name].unshift('isConfig');
}
