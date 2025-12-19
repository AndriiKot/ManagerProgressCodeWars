'use strict';

// API
import {
  getUserAuthored,
  getUserCodeChallenges,
  getCodeChallenge,
} from '#services';

export const createUserServiceDeps = (db) => {
  const {
    insertChallengeSync,
    selectAllChallengeIds,
    insertAuthoredChallengeSync,
    insertCompletedChallengeSync,
  } = db;

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
