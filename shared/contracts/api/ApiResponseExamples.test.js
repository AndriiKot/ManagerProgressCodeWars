'use strict';

import assert from 'node:assert';
import { ApiResponseExamples } from './ApiResponseExamples.js';

const ok = ApiResponseExamples.ok;

assert.strictEqual(ok.success, true, 'ok.success should be true');
assert.strictEqual(ok.url, 'https://example.com/api/resource', 'ok.url is incorrect');
assert.deepStrictEqual(ok.data, { key: 'value' }, 'ok.data is incorrect');
assert.strictEqual(ok.error, null, 'ok.error should be null');

try {
  ok.success = false;
} catch (err) {
  console.log('Cannot modify ok.success:', err.message);
}

try {
  ok.data.key = 'new value';
} catch (err) {
  console.log('Cannot modify ok.data.key:', err.message);
}

console.log('ok after modification attempts:', JSON.stringify(ok, null, 2));

const fail = ApiResponseExamples.fail;

assert.strictEqual(fail.success, false, 'fail.success should be false');
assert.strictEqual(fail.url, 'https://example.com/api/resource', 'fail.url is incorrect');
assert.strictEqual(fail.data, null, 'fail.data should be null');
assert.strictEqual(fail.error, 'Some error', 'fail.error is incorrect');

try {
  fail.error = null;
} catch (err) {
  console.log('Cannot modify fail.error:', err.message);
}

console.log('fail after modification attempts:', JSON.stringify(fail, null, 2));

console.log('All tests passed!');
