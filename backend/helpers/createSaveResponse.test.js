'use strict';

import assert from 'node:assert';
import { createSaveResponse } from './createSaveResponse.js';

const SaveResponse = createSaveResponse();

// ====== OK RESPONSE ======
const okResponse = SaveResponse.ok(
  { challenges: ['a', 'b'] },
  2, // savedCount
  3  // total
);

assert.strictEqual(okResponse.success, true);
assert.deepStrictEqual(okResponse.data, { challenges: ['a', 'b'] });
assert.strictEqual(okResponse.savedCount, 2);
assert.strictEqual(okResponse.total, 3);
assert.strictEqual(okResponse.errors, null);

try {
  okResponse.success = false;
} catch (err) {
  console.log('Cannot modify success:', err.message);
}

try {
  okResponse.data.challenges.push('c');
} catch (err) {
  console.log('Cannot modify data.challenges:', err.message);
}

console.log(
  'okResponse after attempts to modify:',
  JSON.stringify(okResponse, null, 2),
);

// ====== FAIL RESPONSE ======
const failResponse = SaveResponse.fail(
  { challenges: ['a', 'b'] },
  [{ id: 'xyz', error: 'Not found' }],
);

assert.strictEqual(failResponse.success, false);
assert.deepStrictEqual(failResponse.data, { challenges: ['a', 'b'] });
assert.strictEqual(failResponse.savedCount, 0);
assert.strictEqual(failResponse.total, 0);
assert.deepStrictEqual(
  failResponse.errors,
  [{ id: 'xyz', error: 'Not found' }],
);

try {
  failResponse.errors = null;
} catch (err) {
  console.log('Cannot modify errors:', err.message);
}

console.log(
  'failResponse after attempts to modify:',
  JSON.stringify(failResponse, null, 2),
);

console.log('✅ All tests passed');
