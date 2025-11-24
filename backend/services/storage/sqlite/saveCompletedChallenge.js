import { DatabaseSync } from 'node:sqlite';

export const saveCompletedChallenge = (userId, challenge) => {

  const challengeStmt = db.prepare(`
    INSERT OR REPLACE INTO completed_challenges
      (user_id, challenge_id, completed_at)
    VALUES (?, ?, ?)
  `);

  const langStmt = db.prepare(`
    INSERT OR IGNORE INTO completed_challenge_languages
      (completed_challenge_id, language)
    VALUES (?, ?)
  `);

  const result = challengeStmt.run(userId, challenge.id, challenge.completedAt);
  const completedChallengeId = result.lastInsertRowid;

  for (const lang of challenge.completedLanguages) {
    langStmt.run(completedChallengeId, lang);
  }
}

