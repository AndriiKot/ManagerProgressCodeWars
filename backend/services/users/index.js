'use strict';

import { createUserServiceDeps } from './createUserServiceDeps.js';
import { saveAllPages } from './aggregators/index.js';
import { saveAuthoredChallengesSafeSync } from './saveAuthoredChallengesSafeSync.js';
import { saveCompletedChallengesSafeSync } from './saveCompletedChallengesSafeSync.js';
import { saveFullUser } from './saveFullUser.js';

export const createUserService = ({ db }) => {
  // deps — это API + методы работы с БД + внутренние use-case
  const deps = {
    ...createUserServiceDeps({ db }),

    // Добавляем внутренние функции, которые используют другие use-case
    saveCompletedChallengesSafeSync,
    saveAuthoredChallengesSafeSync,
  };

  return {
    // Полный save всего пользователя
    saveFullUser(userId, user) {
      return saveFullUser(db, user, deps);
    },

    // Отдельно можно вызвать authored
    saveAuthoredChallenges(userId, user) {
      return saveAuthoredChallengesSafeSync(db, userId, user, deps);
    },

    // Отдельно можно вызвать completed по страницам
    savePages(userId, user) {
      return saveAllPages(db, userId, user, deps);
    },
  };
};
