'use strict';

const fakeApi = {
  successData: async () => ({ success: true, data: { id: 1, name: 'Test' }, error: null }),
  failData: async () => ({ success: false, data: null, error: 'Network error' }),
  invalidData: async () => ({ success: true, data: { id: 'wrong type' }, error: null }),
};

const simpleValidate = ({ data }) => {
  if (typeof data.id === 'number') {
    return { isValid: true, errors: null };
  } else {
    return { isValid: false, errors: ['id must be number'] };
  }
};

import { validateApiResource } from './validateApiResource.js';

async function runTests() {
  let res;

  res = await validateApiResource({
    apiFn: fakeApi.successData,
    schema: {},
    validateFn: simpleValidate,
  });
  console.log(res);

  res = await validateApiResource({
    apiFn: fakeApi.failData,
    schema: {},
    validateFn: simpleValidate,
  });
  console.log(res);

  res = await validateApiResource({
    apiFn: fakeApi.invalidData,
    schema: {},
    validateFn: simpleValidate,
  });
  console.log(res);

  res = await validateApiResource({
    apiFn: fakeApi.successData,
    schema: {},
  });
  console.log(res);
}

await runTests();
