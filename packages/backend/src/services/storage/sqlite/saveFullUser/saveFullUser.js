'use strict';

import { saveUserProfileSync } from './saveUserProfileSync.js';
import { saveUserRanksSync } from './saveUserRanksSync.js';
import { saveUserSkillsSync } from './saveUserSkillsSync.js';

export const saveFullUser = (db, profile) => {
  const userId = saveUserProfileSync(db, profile);

  if (profile.ranks) {
    saveUserRanksSync(db, userId, profile.ranks);
  }

  if (profile.skills) {
    saveUserSkillsSync(db, userId, profile.skills);
  }

  return userId;
};

