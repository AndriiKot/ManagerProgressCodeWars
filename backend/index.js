import { USER_NAME, FRIENDS } from '#config';
import { CodewarsAPI } from '#api';
import { userProfileSchema, validateWithRankCheck } from '#schemas';
import { Storage } from '#storage';
import { sqlite } from '#db';
import { deepFreezeArray, checkUsersLimit, withTimeout } from '#utils';
import { buildGlobalCache } from '#cache';

const { bootstrapDatabase } = sqlite;


(async () => {

  const { getUserProfile } = CodewarsAPI;

  const usersToCheck = deepFreezeArray([USER_NAME, ...FRIENDS]);
  checkUsersLimit(usersToCheck);

  const db = bootstrapDatabase();
  const cache = await buildGlobalCache(db);

  for (const username of usersToCheck) {
    try {
      const { success, data: profileData } = await withTimeout(
        () => getUserProfile(username),
        7000,
        1
      );

      if (!success) {
        console.warn(`Failed to fetch profile for ${username}`);
        continue;
      }

      const validationResult = validateWithRankCheck({
        schema: userProfileSchema,
        data: profileData,
        options: { recursive: true, strict: true },
      });

      if (validationResult.isValid) {
        console.log(`User profile ${username} data is valid!`);
        
      } else {
        console.warn(`User profile ${username} failed validation`, validationResult.errors);
      }

    } catch (err) {
      console.error(`Error processing profile for ${username}:`, err.message);
    }
  }
})();
