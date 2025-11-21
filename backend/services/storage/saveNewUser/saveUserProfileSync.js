'use strict';
import { DatabaseSync } from 'node:sqlite';

export function saveUserProfileSync(db, profile) {
  const { username, name, honor, clan, leaderboardPosition } = profile;

  const stmt = db.prepare(`
    INSERT INTO users (username, name, honor, clan, leaderboard_position)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(username) DO UPDATE SET
      name = COALESCE(excluded.name, name),
      honor = COALESCE(excluded.honor, honor),
      clan = COALESCE(excluded.clan, clan),
      leaderboard_position = COALESCE(excluded.leaderboard_position, leaderboard_position),
      updated_at = CURRENT_TIMESTAMP
  `);

  stmt.run(
    username,
    name ?? null,
    honor ?? null,
    clan ?? null,
    leaderboardPosition ?? null
  );

  const row = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  return row.id;
}
