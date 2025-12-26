'use strict';

import { USER_NAME, FRIENDS } from '#config';
import { CodewarsAPI } from '#api';
import { userProfileSchema, validateWithRankCheck } from '#schemas';
import { sqlite } from '#db';
import { deepFreezeArray, checkUsersLimit, withTimeout } from '#utils';
import { buildGlobalCache } from '#cache';
import { createUserService } from '#services';
import { logger } from '#utils';

const { bootstrapDatabase } = sqlite;

export const initialDataSync = async () => {
  logger.info('Running initial data sync');

  const { getUserProfile } = CodewarsAPI;

  const usersToCheck = deepFreezeArray([USER_NAME, ...FRIENDS]);
  checkUsersLimit(usersToCheck);

  const db = bootstrapDatabase();
  const cache = await buildGlobalCache(db);

  const userService = createUserService(db, sqlite);
  const { saveFullUser, saveAuthoredChallenges, savePages } = userService;

  for (const username of usersToCheck) {
    try {
      const { success, data: profileData } = await withTimeout(
        () => getUserProfile(username),
        7000,
        1
      );

      if (!success) {
        logger.warn('Failed to fetch profile', { username });
        continue;
      }

      const validationResult = validateWithRankCheck({
        schema: userProfileSchema,
        data: profileData,
        options: { recursive: true, strict: true },
      });

      if (!validationResult.isValid) {
        logger.warn('User profile failed validation', {
          username,
          errors: validationResult.errors,
        });
        continue;
      }

      logger.info('User profile data is valid', { username });

      try {
        const userId = await saveFullUser(profileData);

        await saveAuthoredChallenges(userId, { username });
        await savePages(userId, { username });

        logger.info('User data synced successfully', { username, userId });
      } catch (err) {
        logger.error('Failed to save user data', {
          username,
          error: err?.message,
        });
      }
    } catch (err) {
      logger.error('Error processing profile', {
        username,
        error: err?.message,
      });
    }
  }
};
