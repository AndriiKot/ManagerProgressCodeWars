'use strict';

import { USER_NAME, FRIENDS } from '#config';
import { CodewarsAPI } from '#api';
import { sqlite } from '#db';
import { deepFreezeArray, checkUsersLimit, withTimeout } from '#utils';
import { buildGlobalCache } from '#cache';
import { userServices } from '#services';
import { bootstrapTestDatabase } from './bootstrapTestDatabase.js';
import { getUserProfile } from '#services';

console.log('⚠️ Running in test mode, database: test_database.sqlite');

(async () => {
  const usersToCheck = deepFreezeArray([USER_NAME, ...FRIENDS]);
  checkUsersLimit(usersToCheck);

  const db = bootstrapTestDatabase('test_database.sqlite');

  for (const username of usersToCheck) {
      const { success, data: profileData, error } = await withTimeout(
        () => getUserProfile(username),
        7000,
        1
      );

      if (!success) {
        console.warn(`Failed to fetch profile for ${username}:`, error);
        continue;
      }

      console.log(`User profile ${username} data is valid!`);
  }
})();
