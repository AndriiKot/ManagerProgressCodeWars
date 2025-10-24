import assert from "node:assert";
import { serializeJsonPrimitive } from "./serializeJsonPrimitive.js";

console.log("=== Running serializeJsonPrimitive tests ===");

try {
  assert.strictEqual(
    serializeJsonPrimitive(42),
    '{"__type":"number","value":42}'
  );

  assert.strictEqual(
    serializeJsonPrimitive("hello"),
    '{"__type":"string","value":"hello"}'
  );

  assert.strictEqual(
    serializeJsonPrimitive(true),
    '{"__type":"boolean","value":true}'
  );

  assert.strictEqual(
    serializeJsonPrimitive(false),
    '{"__type":"boolean","value":false}'
  );

  assert.strictEqual(
    serializeJsonPrimitive(null),
    '{"__type":"object","value":null}'
  );

  console.log("✅ All serializeJsonPrimitive tests passed!");
} catch (err) {
  console.error("❌ Test failed:", err.message);
}
