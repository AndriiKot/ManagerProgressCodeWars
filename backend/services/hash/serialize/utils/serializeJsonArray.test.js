import assert from "node:assert";
import { serializeJsonArray } from "./serializeJsonArray.js";

console.log("=== Running serializeJsonArray tests ===");

try {
  assert.strictEqual(serializeJsonArray([1, 2, 3]), "[1,2,3]");
  assert.strictEqual(serializeJsonArray([{ a: 1 }, { b: 2 }]), '[{"a":1},{"b":2}]');
  assert.strictEqual(serializeJsonArray([[1, 2], [3, 4]]), "[[1,2],[3,4]]");

  console.log("✅ All serializeJsonArray tests passed!");
} catch (err) {
  console.error("❌ Test failed:", err.message);
}
