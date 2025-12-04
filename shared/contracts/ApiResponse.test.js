import assert from 'node:assert';
import { ApiResponse } from './ApiResponse.js';

const okResponse = ApiResponse.ok('http://example.com', { foo: 42 });

assert.strictEqual(okResponse.success, true);
assert.strictEqual(okResponse.url, 'http://example.com');
assert.deepStrictEqual(okResponse.data, { foo: 42 });
assert.strictEqual(okResponse.error, null);

try {
  okResponse.success = false;
} catch (err) {
  console.log('Cannot modify success:', err.message);
}

try {
  okResponse.data.foo = 100;
} catch (err) {
  console.log('Cannot modify data.foo:', err.message);
}

console.log('okResponse after attempts to modify:', JSON.stringify(okResponse, null, 2));

const failResponse = ApiResponse.fail('http://example.com', 'Some error occurred');

assert.strictEqual(failResponse.success, false);
assert.strictEqual(failResponse.url, 'http://example.com');
assert.strictEqual(failResponse.data, null);
assert.strictEqual(failResponse.error, 'Some error occurred');

try {
  failResponse.error = null;
} catch (err) {
  console.log('Cannot modify error:', err.message);
}

console.log('failResponse after attempts to modify:', JSON.stringify(failResponse, null, 2));
