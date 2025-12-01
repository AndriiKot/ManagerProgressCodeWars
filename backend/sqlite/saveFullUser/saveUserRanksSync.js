'use strict';
import { DatabaseSync } from 'node:sqlite';

export const saveUserRanksSync = (db, userId, ranksData) => {
  const userRow = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
  if (!userRow) throw new Error(`User with id ${userId} not found`);
  const user_id = userRow.id;

  // Overall
  if (ranksData.overall) {
    const { rank: rankId, score } = ranksData.overall;
    db.prepare(`
      INSERT INTO user_ranks (user_id, scope, language, rank_id, score)
      VALUES (?, 'overall', '', ?, ?)
      ON CONFLICT(user_id, scope, language) DO UPDATE SET
        rank_id = excluded.rank_id,
        score = excluded.score
    `).run(user_id, rankId, score ?? 0);
  }

  // Languages
  if (ranksData.languages) {
    for (const [language, langData] of Object.entries(ranksData.languages)) {
      const { rank: rankId, score } = langData;
      db.prepare(`
        INSERT INTO user_ranks (user_id, scope, language, rank_id, score)
        VALUES (?, 'language', ?, ?, ?)
        ON CONFLICT(user_id, scope, language) DO UPDATE SET
          rank_id = excluded.rank_id,
          score = excluded.score
      `).run(user_id, language, rankId, score ?? 0);
    }
  }
};
