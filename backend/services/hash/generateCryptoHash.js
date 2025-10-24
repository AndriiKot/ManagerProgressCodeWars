import { serializeValidJSON } from "./serialize/index.js";
import { generateSha256Hash } from "./generateSha256Hash.js";

/**
 * Generate a SHA-256 hash of valid JSON data.
 *
 * This function serializes the input data using `serializeValidJSON`
 * (which expects valid JSON: objects, arrays, or primitives), and then
 * computes a SHA-256 hash of the resulting string.
 *
 * @param {JsonValue} data - The input data to hash. Must be valid JSON.
 * @returns {string} A hexadecimal SHA-256 hash of the serialized data.
 *
 * @example
 * const hash1 = generateCryptoHash({ a: 1, b: 2 });
 * const hash2 = generateCryptoHash([1, 2, 3]);
 * const hash3 = generateCryptoHash("hello");
 */
export const generateCryptoHash = (data) => {
  const serialized = serializeValidJSON(data);
  return generateSha256Hash(serialized);
};
