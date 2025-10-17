import crypto from "node:crypto";

/**
 * Generates a SHA-256 hash from a string
 *
 * @param {string} inputStr - The string to hash
 * @returns {string} - The SHA-256 hash of the input string
 */
export const generateSha256Hash = (inputStr) => {
  const hash = crypto.createHash("sha256");
  hash.update(inputStr, "utf8");
  return hash.digest("hex");
};

/**
 * Serializes an object into a deterministic string for hashing
 *
 * @param {Object} obj - The object to serialize
 * @param {string[]} fields - Optional list of fields to include in the serialized string
 * @returns {string} - The serialized string
 */
export const serializeObjectForHash = (obj, fields = []) => {
  const data = fields.reduce((result, field) => {
    if (obj[field] !== undefined) result[field] = obj[field];
    return result;
  }, {});

  return JSON.stringify(data, Object.keys(data).sort());
};
