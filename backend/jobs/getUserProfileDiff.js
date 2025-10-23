import { getProfile } from "./api/codewarsAPI.js";
import { USER_NAME } from "./config.js";
import storage from "./services/hash/storage.js";
import { PROFILE_SCHEMA } from "./schemas/profileSchema.js";

/**
 * Get a nested property from an object using dot notation path
 * @param {Object} obj - The object to access
 * @param {string} path - Dot notation path (e.g. "codeChallenges.totalAuthored")
 * @returns {any} The nested value or undefined if not found
 */
const getNested = (obj, path) =>
  path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);

/**
 * Checks for updates in a user's Codewars profile.
 * Only performs checks without writing to cache.
 * @returns {Object} An object with the structure:
 * {
 *   Ranks: { changed: true, value: ... },
 *   Position: { changed: false, value: ... },
 *   ...
 * }
 */
export const getUserProfileDiff = async () => {
  const profileData = await fetch(getProfile(USER_NAME)).then((res) =>
    res.json()
  );

  const result = {};

  for (const key in PROFILE_SCHEMA) {
    const { path, useCryptoHash } = PROFILE_SCHEMA[key];
    const value = getNested(profileData, path);

    const changed = useCryptoHash
      ? storage.checkCryptoHashChanged(key, value)
      : storage[`load${key}`]?.() !== value;

    result[key] = { changed, value };
  }

  return result;
};
