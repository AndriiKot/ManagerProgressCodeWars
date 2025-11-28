import assert from 'node:assert';
import { serializeValidJSON } from './serializeValidJSON.js';

console.log('=== Running serializeValidJSON tests ===');

try {
  assert.strictEqual(serializeValidJSON([1, 2, 3]), '[1,2,3]');

  assert.strictEqual(serializeValidJSON({ b: 2, a: 1 }), '{"a":1,"b":2}');

  assert.strictEqual(
    serializeValidJSON({ b: { y: 2, x: 1 }, a: 1 }),
    '{"a":1,"b":{"y":2,"x":1}}',
  );

  assert.strictEqual(serializeValidJSON(42), '{"__type":"number","value":42}');

  assert.strictEqual(
    serializeValidJSON('hello'),
    '{"__type":"string","value":"hello"}',
  );

  assert.strictEqual(
    serializeValidJSON(true),
    '{"__type":"boolean","value":true}',
  );

  assert.strictEqual(
    serializeValidJSON(null),
    '{"__type":"object","value":null}',
  );

  console.log('✅ All serializeValidJSON tests passed!');
} catch (err) {
  console.error('❌ Test failed:', err.message);
}
