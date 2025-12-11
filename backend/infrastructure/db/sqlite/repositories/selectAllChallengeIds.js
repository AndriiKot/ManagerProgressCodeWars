'use strict';

export const selectAllChallengeIds = (db) => {
  const stmt = db.prepare(`SELECT id FROM challenges`);
  const rows = stmt.all();
  return rows.map(r => r.id);  
};
