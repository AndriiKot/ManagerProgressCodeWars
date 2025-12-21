'use strict';

import { createUserServiceDeps } from './createUserServiceDeps.js';
import { saveAllPages } from './aggregators/index.js';
import { saveAuthoredChallengesSafeSync } from './saveAuthoredChallengesSafeSync.js';
import { saveCompletedChallengesSafeSync } from './saveCompletedChallengesSafeSync.js';
import { saveFullUser } from './saveFullUser.js';

export const createUserService = (db, sqlite) => {
  const deps = {
    ...createUserServiceDeps(sqlite),

    saveCompletedChallengesSafeSync,
    saveAuthoredChallengesSafeSync,
  };

  return {
    saveFullUser(profile) {
      return saveFullUser(db, profile, deps);
    },

    saveAuthoredChallenges(userId, user) {
      return saveAuthoredChallengesSafeSync(db, userId, user, deps);
    },

    savePages(userId, user) {
      return saveAllPages(db, userId, user, deps);
    },
  };
};
