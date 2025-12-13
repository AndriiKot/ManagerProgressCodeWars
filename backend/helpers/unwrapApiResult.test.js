'use strict';

import assert from 'node:assert';
import { unwrapApiResult } from './unwrapApiResult.js';

(() => {
  const res = {
    success: true,
    isValid: true,
    data: { items: [1, 2, 3] },
  };

  const result = unwrapApiResult(res);
  assert.strictEqual(result.ok, true);
  assert.deepStrictEqual(result.data, { items: [1, 2, 3] });
  assert.strictEqual(result.error, undefined);
  console.log('Test 1 passed ✅');
})();

(() => {
  const res = {
    success: false,
    error: 'Network error',
  };

  const result = unwrapApiResult(res);
  assert.strictEqual(result.ok, false);
  assert.strictEqual(result.error, 'Network error');
  assert.strictEqual(result.data, undefined);
  console.log('Test 2 passed ✅');
})();

(() => {
  const res = {
    success: true,
    isValid: false,
    validationErrors: ['invalid data'],
  };

  const result = unwrapApiResult(res);
  assert.strictEqual(result.ok, false);
  assert.deepStrictEqual(result.error, ['invalid data']);
  assert.strictEqual(result.data, undefined);
  console.log('Test 3 passed ✅');
})();
