import assert from "node:assert";
import { generateCryptoHash } from "./generateCryptoHash.js";

console.log("=== Running generateCryptoHash tests ===");

try {
  const hash1 = generateCryptoHash({ a: 1, b: 2 });
  const hash2 = generateCryptoHash({ b: 2, a: 1 });
  const hash3 = generateCryptoHash([1, 2, 3]);
  const hash4 = generateCryptoHash("hello");
  const hash5 = generateCryptoHash(42);

  assert.strictEqual(hash1, hash2, "Hashes for objects with same keys/values should match");
  assert.notStrictEqual(hash1, hash3, "Object and array should produce different hashes");
  assert.notStrictEqual(hash4, hash5, "String and number should produce different hashes");

  console.log("✅ All generateCryptoHash tests passed!");
} catch (err) {
  console.error("❌ Test failed:", err.message);
}
