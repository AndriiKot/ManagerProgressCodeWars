'use strict';

// API
import {
  getUserAuthored,
  getUserCodeChallenges,
  getCodeChallenge,
} from '#services';

import { createSafeApiCall } from '#utils';

export const createUserServiceDeps = (sqlite) => {
  const {
    insertChallengeSync,
    selectAllChallengeIds,
    insertAuthoredChallengeSync,
    insertCompletedChallengeSync,
  } = sqlite;

  const safeApiCall = createSafeApiCall({
    concurrency: 5,
    interval: 300,
  });

  return Object.freeze({

    getUserAuthored: safeApiCall(getUserAuthored),
    getUserCodeChallenges: safeApiCall(getUserCodeChallenges),
    getCodeChallenge: safeApiCall(getCodeChallenge),

    insertChallengeSync,
    insertAuthoredChallengeSync,
    insertCompletedChallengeSync,
    selectAllChallengeIds,
  });
};
