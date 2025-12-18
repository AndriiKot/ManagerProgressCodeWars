'use strict';

import { deepFreeze } from '#utils';

const contract = ({ success, url, data = null, error = null }) => {
  return deepFreeze({ success, url, data, error });
};

export const ApiResponse = {
  ok(url, data) {
    return contract({ success: true, url, data });
  },

  fail(url, error) {
    return contract({ success: false, url, error });
  },
};
