'use strict';

import { USER_NAME, FRIENDS } from '#config';
import { sqlite } from '#db';
import { deepFreezeArray, checkUsersLimit, withTimeout } from '#utils';
import { bootstrapTestDatabase } from './bootstrapTestDatabase.js';
import { getUserProfile, createUserService } from '#services';
import { logger } from '#utils';

logger.info('⚠️ Running in test mode, database: test_database.sqlite');

(async () => {
  const usersToCheck = deepFreezeArray([USER_NAME, ...FRIENDS]);
  checkUsersLimit(usersToCheck);

  const db = bootstrapTestDatabase('test_database.sqlite');

  const userService = createUserService(
    db,
    sqlite
  );

  const { saveFullUser, saveAuthoredChallenges, savePages } = userService;

  for (const username of usersToCheck) {
      const { success, data: profileData, error, isValid, validationErrors } = await withTimeout(
        () => getUserProfile(username),
        7000,
        1
      );

      if (!success) {
        logger.warn('Failed to fetch profile for', { username, error });
        continue;
      }
 
      if (!isValid) {
        logger.warn('Respons data is not valid for',{ username, validationErrors });
        continue;
      }

      logger.info('User profile data is valid!', { username });

      try {
        const userId = await saveFullUser(profileData);
        await saveAuthoredChallenges(userId, { username });
        await savePages(userId, { username });
      } catch (err) {
        logger.error(`Failed to save data for `, { username, errors: err?.messages });
      }           
  }
})();
