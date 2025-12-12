'use strict';

import { loadUsersCache } from '#cache';
import { sqlite } from '#db';

const { selectAllChallengeIds } = sqlite;

export const buildGlobalCache = async (db) => {
  const { 0: usersCache, 1: challengeIds } = await Promise.all([
    loadUsersCache(),
    Promise.resolve(selectAllChallengeIds(db)),
  ]);

  return {
    users:  usersCache,
    challenges: challengeIds,
  };
};
