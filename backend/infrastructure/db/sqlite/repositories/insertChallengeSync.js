'use strict';

export const insertChallengeSync = (db, challenge) => {
  const {
    id,
    name,
    slug,
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
    url,
    contributorsWanted,
    unresolved,
    languages = [],
    tags = []
  } = challenge;

  const rankId = rank?.id ?? 0;

  db.exec('BEGIN TRANSACTION');
  try {
    const stmt = db.prepare(`
      INSERT INTO challenges (
        id, name, slug, category, rank_id,
        created_by_username, approved_by_username,
        total_attempts, total_completed, total_stars, vote_score,
        published_at, approved_at, url,
        contributors_wanted, unresolved_issues, unresolved_suggestions,
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        slug = excluded.slug,
        category = excluded.category,
        rank_id = excluded.rank_id,
        created_by_username = excluded.created_by_username,
        approved_by_username = excluded.approved_by_username,
        total_attempts = excluded.total_attempts,
        total_completed = excluded.total_completed,
        total_stars = excluded.total_stars,
        vote_score = excluded.vote_score,
        published_at = excluded.published_at,
        approved_at = excluded.approved_at,
        url = excluded.url,
        contributors_wanted = excluded.contributors_wanted,
        unresolved_issues = excluded.unresolved_issues,
        unresolved_suggestions = excluded.unresolved_suggestions,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(
      id, name, slug, category, rankId,
      createdBy?.username ?? null,
      approvedBy?.username ?? null,
      totalAttempts ?? null,
      totalCompleted ?? null,
      totalStars ?? null,
      voteScore ?? null,
      publishedAt ?? null,
      approvedAt ?? null,
      url ?? null,
      contributorsWanted ? 1 : 0,
      unresolved?.issues ?? 0,
      unresolved?.suggestions ?? 0
    );

    if (tags.length) {
      const tagStmt = db.prepare(`
        INSERT INTO challenge_tags (challenge_id, tag)
        VALUES (?, ?)
        ON CONFLICT(challenge_id, tag) DO NOTHING
      `);
      for (const tag of tags) tagStmt.run(id, tag);
    }

    if (languages.length) {
      const langStmt = db.prepare(`
        INSERT INTO challenge_languages (challenge_id, language)
        VALUES (?, ?)
        ON CONFLICT(challenge_id, language) DO NOTHING
      `);
      for (const lang of languages) langStmt.run(id, lang);
    }

    db.exec('COMMIT');

    return id;

  } catch (err) {
    db.exec('ROLLBACK');
    console.error('Error inserting challenge:', err);
    throw err;
  }
};
