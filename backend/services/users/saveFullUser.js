'use strict';

import { sqlite } from '#db';

const { insertUserProfileSync, insertUserRanksSync, insertUserSkillsSync } = sqlite;

export const saveFullUser = (db, profile) => {
  const userId = insertUserProfileSync(db, profile);

  if (profile.ranks) {
    insertUserRanksSync(db, userId, profile.ranks);
  }

  if (profile.skills) {
    insertUserSkillsSync(db, userId, profile.skills);
  }

  return userId;
};

