'use strict';

export const ApiResponseExamples = {
  ok: {
    success: true,
    url: 'https://example.com/api/resource',
    data: { key: 'value' },
    error: null
  },
  fail: {
    success: false,
    url: 'https://example.com/api/resource',
    data: null,
    error: 'Some error'
  }
};

