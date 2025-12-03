'use strict';

export const insertUserSkillsSync = (db, userId, skills) => {
  if (skills.length) {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO user_skills (user_id, skill)
      VALUES (?, ?)
    `);

  db.exec('BEGIN TRANSACTION');
    try {
      for (const skill of skills) {
        stmt.run(userId, skill);
      }
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
  }
};

