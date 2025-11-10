import assert from 'node:assert';
import { serializeJsonObject } from './serializeJsonObject.js';

console.log('=== Running serializeJsonObject tests ===');

try {
  assert.strictEqual(serializeJsonObject({ b: 2, a: 1 }), '{"a":1,"b":2}');

  assert.strictEqual(
    serializeJsonObject({ b: { y: 2, x: 1 }, a: 1 }),
    '{"a":1,"b":{"y":2,"x":1}}',
  );

  assert.strictEqual(
    serializeJsonObject({ a: 1, b: null, c: [1, 2] }),
    '{"a":1,"b":null,"c":[1,2]}',
  );

  console.log('✅ All serializeJsonObject tests passed!');
} catch (err) {
  console.error('❌ Test failed:', err.message);
}
