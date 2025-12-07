'use strict';

export const insertUserProfileSync = (db, profile) => {
  const {
    id: codewars_id,
    username,
    name,
    honor,
    clan,
    leaderboardPosition,
    codeChallenges: { totalCompleted, totalAuthored } = {},
  } = profile;

  const stmt = db.prepare(`
    INSERT INTO users (
      username,
      codewars_id,
      name,
      honor,
      clan,
      leaderboard_position,
      total_completed,
      total_authored
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(username) DO UPDATE SET
      codewars_id = COALESCE(excluded.codewars_id, users.codewars_id),
      name = COALESCE(excluded.name, users.name),
      honor = COALESCE(excluded.honor, users.honor),
      clan = COALESCE(excluded.clan, users.clan),
      leaderboard_position = COALESCE(excluded.leaderboard_position, users.leaderboard_position),
      total_completed = COALESCE(excluded.total_completed, users.total_completed),
      total_authored = COALESCE(excluded.total_authored, users.total_authored),
      updated_at = CURRENT_TIMESTAMP
  `);

  stmt.run(
    username,
    codewars_id,
    name ?? null,
    honor ?? null,
    clan ?? null,
    leaderboardPosition ?? null,
    totalCompleted ?? null,
    totalAuthored ?? null
  );

  return db.prepare('SELECT id FROM users WHERE username = ?').get(username).id;
};
