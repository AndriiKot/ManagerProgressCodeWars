'use strict';

import { deepFreeze } from '#utils';

export const SaveCompletedResponse = {
  ok(data = null, savedCount = 0, total = 0, errors = null) {
    return deepFreeze({ success: true, data, savedCount, total, errors });
  },
  fail(data = null, error = null) {
    return deepFreeze({
      success: false,
      data,
      savedCount: 0,
      total: 0,
      errors: error,
    });
  },
};

