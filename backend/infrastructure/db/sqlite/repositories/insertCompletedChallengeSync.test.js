'use strict';

import { DatabaseSync } from 'node:sqlite';
import { insertCompletedChallengeSync } from './insertCompletedChallengeSync.js';

function runTests() {
  const db = new DatabaseSync(':memory:');

  try {
    console.log('=== Creating tables ===');

    // Таблица пользователей
    db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL
      ) STRICT
    `);

    // Таблица челленджей
    db.exec(`
      CREATE TABLE challenges (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      ) STRICT
    `);

    // Таблица завершённых челленджей
    db.exec(`
      CREATE TABLE completed_challenges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
        completed_at TEXT NOT NULL,
        languages_json TEXT CHECK (json_valid(languages_json) OR languages_json IS NULL),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, challenge_id) ON CONFLICT REPLACE
      ) STRICT
    `);

    // Таблица языков завершённых челленджей
    db.exec(`
      CREATE TABLE completed_challenge_languages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        completed_challenge_id INTEGER NOT NULL REFERENCES completed_challenges(id) ON DELETE CASCADE,
        language TEXT NOT NULL,
        UNIQUE(completed_challenge_id, language)
      ) STRICT
    `);

    console.log('=== Tables created ===');

    // Вставляем тестового пользователя и челлендж
    const userId = db.prepare('INSERT INTO users (username) VALUES (?)').run('testuser').lastInsertRowid;
    const challengeId = 'test-challenge-1';
    db.prepare('INSERT INTO challenges (id, name) VALUES (?, ?)').run(challengeId, 'Test Challenge');

    const completedChallenge = {
      id: challengeId,
      completedAt: new Date().toISOString(),
      completedLanguages: ['javascript', 'python', 'ruby']
    };

    console.log('--- Insert first completed challenge ---');
    insertCompletedChallengeSync(db, userId, completedChallenge);

    const row = db.prepare('SELECT * FROM completed_challenges WHERE user_id = ? AND challenge_id = ?')
                  .get(userId, challengeId);

    console.log(row);

    const langs = db.prepare('SELECT language FROM completed_challenge_languages WHERE completed_challenge_id = ? ORDER BY language')
                    .all(row.id)
                    .map(r => r.language);

    console.log('Languages:', langs);

    if (langs.length === completedChallenge.completedLanguages.length &&
        langs.every(l => completedChallenge.completedLanguages.includes(l))) {
      console.log('✅ Insert completed challenge & languages successful');
    } else {
      console.error('❌ Insert failed');
    }

    // Проверка уникальности
    console.log('--- Insert duplicate ---');
    insertCompletedChallengeSync(db, userId, completedChallenge);

    const langsAfter = db.prepare('SELECT language FROM completed_challenge_languages WHERE completed_challenge_id = ? ORDER BY language')
                         .all(row.id)
                         .map(r => r.language);

    console.log('Languages after duplicate insert:', langsAfter);

    if (langsAfter.length === langs.length) {
      console.log('✅ Deduplication successful');
    } else {
      console.error('❌ Deduplication failed');
    }

  } finally {
    db.close();
    console.log('✅ Database connection closed');
  }
}

runTests();
