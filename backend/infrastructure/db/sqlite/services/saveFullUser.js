'use strict';

import { sqlite } from '#db';

const { saveUserProfileSync, saveUserRanksSync, saveUserSkillsSync } = sqlite;


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

