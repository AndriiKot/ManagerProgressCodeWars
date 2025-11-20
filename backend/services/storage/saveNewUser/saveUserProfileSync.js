'use strict';
import { DatabaseSync } from 'node:sqlite';

export function saveUserProfileSync(db, profile) {
  const { username, name, honor, clan, leaderboardPosition } = profile;

  const stmt = db.prepare(`
    INSERT INTO users (username, name, honor, clan, leaderboard_position)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(username) DO UPDATE SET
      name = excluded.name,
      honor = excluded.honor,
      clan = excluded.clan,
      leaderboard_position = excluded.leaderboard_position,
      updated_at = CURRENT_TIMESTAMP
  `);

  stmt.run(username, name ?? null, honor ?? 0, clan ?? null, leaderboardPosition ?? null);

  const row = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  return row.id;
}
