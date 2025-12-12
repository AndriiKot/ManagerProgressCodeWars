'use strict';

import { loadUsersCache } from '#cache';
import { sqlite } from '#db';

const { selectAllChallengeIds, selectAllUsersSlugsAndIds } = sqlite;

export const buildGlobalCache = async (db) => {
  const { 0: usersCache, 1: challengeIds, 2: usersSlugAndIds } = await Promise.all([
    loadUsersCache(),
    Promise.resolve(selectAllChallengeIds(db)),
    Promise.resolve(selectAllUsersSlugsAndIds(db)),
  ]);

  const { slugs, ids } = usersSlugAndIds;

  return {
    usersSlug: slugs,
    usersIds: ids,
    users:  usersCache,
    challenges: challengeIds,
  };
};
