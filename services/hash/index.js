import { generateSha256Hash, serializeObjectForHash } from "./cryptoUtils.js";
import storage from "./storage.js";
const { saveRanks, loadRanks } = storage;

/**
 * Computes a SHA-256 hash for an object
 * @param {Object} obj - The object to hash
 * @returns {string} - The computed hash
 */
export const computeHash = (obj) => {
  const serialized = serializeObjectForHash(obj);
  return generateSha256Hash(serialized);
};

/**
 * Checks if object has changed compared to the cached hash
 * @param {Object} obj - The object to check
 * @returns {boolean} - True if changed, false otherwise
 */
export const hasChanged = (obj) => {
  const newHash = computeHash(obj);
  const oldHash = loadRanks();
  const changed = newHash !== oldHash;

  if (changed) {
    saveRanks(newHash);
  }

  return changed;
};
