'use strict';

import { saveAllPages } from './aggregators/saveAllPages.js';
import { saveCompletedChallengesSafeSync } from './saveCompletedChallengesSafeSync.js';
import { saveAuthoredChallengesSafeSync } from './saveAuthoredChallengesSafeSync.js';
import { saveFullUser } from './saveFullUser.js';

export const userServices = {
  saveAllPages,
  saveCompletedChallengesSafeSync,
  saveAuthoredChallengesSafeSync,
  saveFullUser,
};
