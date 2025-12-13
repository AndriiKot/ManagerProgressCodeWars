'use strict';

export const unwrapApiResult = (res) => {
  if (!res.success) {
    return { ok: false, error: res.error };
  }

  if (!res.isValid) {
    return { ok: false, error: res.validationErrors };
  }

  return { ok: true, data: res.data };
};

