import crypto from "node:crypto";

/**
 * Serializes any JavaScript value into a deterministic string representation.
 *
 * - Arrays are serialized as-is (`JSON.stringify`).
 * - Objects are serialized with sorted keys to ensure consistent order.
 * - Primitive values (string, number, boolean, null, undefined) are wrapped
 *   with a type descriptor to differentiate similar-looking values (e.g. `"123"` vs `123`).
 *
 * @param {*} raw - The value to serialize.
 * @returns {string} A stable string representation suitable for hashing.
 */
const serialize = (raw) => {
  if (Array.isArray(raw)) return JSON.stringify(raw);
  if (typeof raw === "object" && raw !== null)
    return JSON.stringify(raw, Object.keys(raw).sort());
  return JSON.stringify({ __type: typeof raw, value: raw });
};

/**
 * Generates a SHA-256 hash from a given string.
 *
 * @param {string} str - The string to hash.
 * @returns {string} The SHA-256 hash in hexadecimal format.
 */
const generateSha256Hash = (str) => {
  const hash = crypto.createHash("sha256");
  hash.update(str, "utf8");
  return hash.digest("hex");
};

/**
 * Generates a stable SHA-256 hash for any JavaScript value.
 *
 * Uses `serialize()` to ensure deterministic serialization before hashing.
 * This guarantees that equivalent data structures (even with different key orders)
 * will produce the same hash.
 *
 * @param {*} data - The data to hash.
 * @returns {string} The SHA-256 hash of the serialized data.
 */
export const generateCryptoHash = (data) => {
  const serialized = serialize(data);
  return generateSha256Hash(serialized);
};
