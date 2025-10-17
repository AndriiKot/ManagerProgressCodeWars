import { generateSha256Hash, serializeObjectForHash } from "./cryptoUtils.js";
import { saveHash, loadHash } from "./storage.js";

/**
 * ComputesHash
 *
 * Computes a SHA-256 hash for an object with
 * optional field selection
 *
 * @param {Object} obj - the object to hash
 * @param {string[]} fields - the fields to include in the hash
 * @returns {string} - the computed hash
 */
export const computeHash = (obj, fields = []) => {
  const serialized = serializeObjectForHash(obj, fields);
  return generateSha256Hash(serialized);
};

/**
 * Checks if an object has changed
 *
 * Computes a new hash for the object and compares it
 * with the stored hash. If the hashes are different,
 * the new hash is stored and true is returned.
 *
 * @param {string} name - the name of the object to check
 * @param {Object} obj - the object to hash
 * @param {string[]} fields - the fields to include in the hash
 * @returns {boolean} - true if the object has changed, false otherwise
 */
export const hasChanged = (name, obj, fields = []) => {
  const newHash = computeHash(obj, fields);
  const oldHash = loadHash(name);
  const hasChanged = newHash !== oldHash;
  if (hasChanged) saveHash(name, newHash);
  return hasChanged;
};
