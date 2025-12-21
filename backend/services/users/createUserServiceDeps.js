'use strict';

// API
import {
  getUserAuthored,
  getUserCodeChallenges,
  getCodeChallenge,
} from '#services';

export const createUserServiceDeps = (sqlite) => {
  const {
    insertChallengeSync,
    selectAllChallengeIds,
    insertAuthoredChallengeSync,
    insertCompletedChallengeSync,
  } = sqlite;

  return Object.freeze({
    // API
    getUserAuthored,
    getUserCodeChallenges,
    getCodeChallenge,

    // DB
    insertChallengeSync,
    insertAuthoredChallengeSync,
    insertCompletedChallengeSync,
    selectAllChallengeIds,
  });
};
