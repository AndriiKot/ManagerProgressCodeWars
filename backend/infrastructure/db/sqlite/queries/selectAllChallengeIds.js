'use strict';

export const selectAllChallengeIds = (db) => {
  const stmt = db.prepare(`SELECT id FROM challenges`);
  const rows = stmt.all();
  const challenges = new Set(rows.map(r => r.id));
  return challenges;
};
