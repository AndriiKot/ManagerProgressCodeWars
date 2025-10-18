import crypto from "node:crypto";

/**
 * Generates a SHA-256 hash from the given string.
 *
 * @param {string} inputStr - The string to hash.
 * @returns {string} - The SHA-256 hash in hexadecimal format.
 */
export const generateSha256Hash = (inputStr) => {
  const hash = crypto.createHash("sha256");
  hash.update(inputStr, "utf8");
  return hash.digest("hex");
};

/**
 * Serializes an object into a deterministic string for hashing.
 * Keys are sorted alphabetically to ensure consistent output.
 *
 * @param {Object} obj - The object to serialize.
 * @returns {string} - The serialized string representation of the object.
 */
export const serializeObjectForHash = (obj) => {
  return JSON.stringify(obj, Object.keys(obj).sort());
};
