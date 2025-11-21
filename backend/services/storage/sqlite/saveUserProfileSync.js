'use strict';
import { DatabaseSync } from 'node:sqlite';

export function saveUserProfileSync(db, profile) {
  const {
    id: codewars_id,
    username,
    name,
    honor,
    clan,
    leaderboardPosition,
  } = profile;

  const stmt = db.prepare(`
    INSERT INTO users (
      username,
      name,
      honor,
      clan,
      leaderboard_position,
      codewars_id
    )
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(username) DO UPDATE SET
      name = COALESCE(excluded.name, users.name),
      honor = COALESCE(excluded.honor, users.honor),
      clan = COALESCE(excluded.clan, users.clan),
      leaderboard_position = COALESCE(excluded.leaderboard_position, users.leaderboard_position),
      codewars_id = COALESCE(excluded.codewars_id, users.codewars_id),
      updated_at = CURRENT_TIMESTAMP
  `);

  stmt.run(
    username,
    name ?? null,
    honor ?? null,
    clan ?? null,                     
    leaderboardPosition ?? null,
    codewars_id ?? null
  );

  return db.prepare('SELECT id FROM users WHERE username = ?').get(username).id;
}
