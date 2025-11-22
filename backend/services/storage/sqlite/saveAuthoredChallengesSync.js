'use strict';

export const saveAuthoredChallengesSync = (db, userId, authoredList = []) => {
  if (authoredList.length) {

    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO authored_challenges (user_id, challenge_id)
      VALUES (?, ?)
    `);

    db.exec('BEGIN TRANSACTION');

    try {
      for (const ch of authoredList) {
        if (ch.id == null) throw new Error('challenge id cannot be null');
        insertStmt.run(userId, ch.id);
      }
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
  }
};
