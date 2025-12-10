import { USER_NAME, FRIENDS } from '#config';
import { CodewarsAPI } from '#api';
import { userProfileSchema, validateWithRankCheck } from '#schemas';
import { Storage } from '#storage';
import { sqlite } from '#db';
import { deepFreezeArray, checkFriendsLimit } from '#utils';

const { bootstrapDatabase } = sqlite;

(async () => {
  const { getUserProfile } = CodewarsAPI;

  const usersToCheck = deepFreezeArray([USER_NAME, ...FRIENDS]);

  try {
    checkFriendsLimit(usersToCheck);
  } catch (err) {
    console.error('Users limit exceeded:', err.message);
    process.exit(1);
  }

  const db = bootstrapDatabase();

  for (const username of usersToCheck) {
    try {
      const { success, data: profileData } = await getUserProfile(username);

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
        // await Storage.update({ user: username, data: profileData });
      } else {
        console.warn(`User profile ${username} failed validation`, validationResult.errors);
      }

    } catch (err) {
      console.error(`Error processing profile for ${username}:`, err);
    }
  }
})();
