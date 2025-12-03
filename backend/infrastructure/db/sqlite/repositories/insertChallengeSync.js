'use strict';

export const insertChallengeSync = (db, challenge) => {
  const {
    id,
    name,
    slug,
    description,
    category,
    rank,
    createdBy,
    approvedBy,
    totalAttempts,
    totalCompleted,
    totalStars,
    voteScore,
    publishedAt,
    approvedAt,
    languages = [],
    tags = [],
  } = challenge;

  const rankId = rank?.id ?? 0;

  const stmt = db.prepare(`
    INSERT INTO challenges (
      id, name, slug, description, category, rank_id,
      created_by_username, approved_by_username,
      total_attempts, total_completed, total_stars, vote_score,
      published_at, approved_at, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      name = COALESCE(excluded.name, challenges.name),
      slug = COALESCE(excluded.slug, challenges.slug),
      description = COALESCE(excluded.description, challenges.description),
      category = COALESCE(excluded.category, challenges.category),
      rank_id = COALESCE(excluded.rank_id, challenges.rank_id),
      created_by_username = COALESCE(excluded.created_by_username, challenges.created_by_username),
      approved_by_username = COALESCE(excluded.approved_by_username, challenges.approved_by_username),
      total_attempts = COALESCE(excluded.total_attempts, challenges.total_attempts),
      total_completed = COALESCE(excluded.total_completed, challenges.total_completed),
      total_stars = COALESCE(excluded.total_stars, challenges.total_stars),
      vote_score = COALESCE(excluded.vote_score, challenges.vote_score),
      published_at = COALESCE(excluded.published_at, challenges.published_at),
      approved_at = COALESCE(excluded.approved_at, challenges.approved_at),
      updated_at = CURRENT_TIMESTAMP
  `);

  stmt.run(
    id, name, slug, description, category, rankId,
    createdBy?.username ?? null,
    approvedBy?.username ?? null,
    totalAttempts ?? null,
    totalCompleted ?? null,
    totalStars ?? null,
    voteScore ?? null,
    publishedAt ?? null,
    approvedAt ?? null
  );

  if (tags.length) {
    const tagStmt = db.prepare(`
      INSERT INTO challenge_tags (challenge_id, tag, created_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(challenge_id, tag) DO NOTHING
    `);

    db.exec('BEGIN TRANSACTION');
    try {
      for (const tag of tags) {
        tagStmt.run(id, tag);
      }
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
  }

  if (languages.length) {
    const langStmt = db.prepare(`
      INSERT INTO challenge_languages (challenge_id, language, created_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(challenge_id, language) DO NOTHING
    `);

    db.exec('BEGIN TRANSACTION');
    try {
      for (const lang of languages) {
        langStmt.run(id, lang);
      }
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
  }

  return db.prepare('SELECT id FROM challenges WHERE id = ?').get(id).id;
};
