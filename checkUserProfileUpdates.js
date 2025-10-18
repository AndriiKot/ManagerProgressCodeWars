import { getProfile } from "./api/codewarsAPI.js";
import { USER_NAME } from "./config.js";
import storage from "./services/hash/storage.js";
import { PROFILE_SCHEMA } from "./schemas/profileSchema.js";

/**
 * Get nested property from object using dot notation path
 */
const getNested = (obj, path) =>
  path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);

/**
 * Check for updates in user's Codewars profile
 * Uses PROFILE_SCHEMA to automatically handle all fields
 */
export const checkUserProfileUpdates = async () => {
  const profileData = await fetch(getProfile(USER_NAME)).then((res) =>
    res.json()
  );
  const result = {};

  for (const [key, { path, useCryptoHash }] of Object.entries(PROFILE_SCHEMA)) {
    const value = getNested(profileData, path);

    if (useCryptoHash) {
      result[`new${key}`] = storage.hasCryptoHashChanged(key, value);
    } else {
      const oldValue = storage[`load${key}`]();
      const changed = oldValue !== value;
      result[`new${key}`] = changed;
      if (changed) storage[`save${key}`](value);
    }
  }

  return result;
};

// Example usage
checkUserProfileUpdates().then(console.log);
