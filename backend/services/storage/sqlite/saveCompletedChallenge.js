import { DatabaseSync } from 'node:sqlite';

export const saveCompletedChallenge = (db, userId, challenge) => {
  const challengeStmt = db.prepare(`
    INSERT OR IGNORE INTO completed_challenges
      (user_id, challenge_id, completed_at)
    VALUES (?, ?, ?)
  `);

  const langStmt = db.prepare(`
    INSERT OR IGNORE INTO completed_challenge_languages
      (completed_challenge_id, language)
    VALUES (?, ?)
  `);

  challengeStmt.run(userId, challenge.id, challenge.completedAt);

  const row = db.prepare(`
    SELECT id FROM completed_challenges
    WHERE user_id = ? AND challenge_id = ?
  `).get(userId, challenge.id);

  const completedChallengeId = row.id;

  for (const lang of challenge.completedLanguages) {
    langStmt.run(completedChallengeId, lang);
  }
};
