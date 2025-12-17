'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';

import { saveCompletedChallengesSafeSync } from './saveCompletedChallengesSafeSync.js';
import { SaveCompletedResponse } from '#contracts';

test('saveCompletedChallengesSafeSync saves challenges and completed links', async () => {
  const db = new DatabaseSync(':memory:');

  try {
    db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL
      ) STRICT;

      CREATE TABLE challenges (
        id TEXT PRIMARY KEY,
        name TEXT
      ) STRICT;

      CREATE TABLE completed_challenges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        challenge_id TEXT NOT NULL,
        completed_at TEXT,
        UNIQUE(user_id, challenge_id)
      ) STRICT;

      CREATE TABLE completed_challenge_languages (
        completed_challenge_id INTEGER NOT NULL,
        language TEXT NOT NULL,
        UNIQUE(completed_challenge_id, language)
      ) STRICT;
    `);

    const userId = db
      .prepare(`INSERT INTO users (username) VALUES (?)`)
      .run('TestUser').lastInsertRowid;

    // ===== MOCKS =====
    const getUserCompleted = async () => ({
      success: true,
      isValid: true,
      data: {
        data: [
          {
            id: 'a1',
            completedAt: '2024-01-01',
            completedLanguages: ['js', 'python'],
          },
          {
            id: 'b2',
            completedAt: '2024-01-02',
            completedLanguages: ['js'],
          },
        ],
      },
    });

    const getCodeChallenge = async (id) => ({
      success: true,
      isValid: true,
      data: { id, name: `Challenge ${id}` },
    });

    const insertChallengeSync = (db, ch) => {
      db.prepare(`INSERT INTO challenges (id, name) VALUES (?, ?)`).run(
        ch.id,
        ch.name,
      );
    };

    const insertCompletedChallengeSync = (db, userId, challenge) => {
      const stmt = db.prepare(`
        INSERT OR IGNORE INTO completed_challenges
          (user_id, challenge_id, completed_at)
        VALUES (?, ?, ?)
      `);

      stmt.run(userId, challenge.id, challenge.completedAt);

      const row = db.prepare(`
        SELECT id FROM completed_challenges
        WHERE user_id = ? AND challenge_id = ?
      `).get(userId, challenge.id);

      for (const lang of challenge.completedLanguages) {
        db.prepare(`
          INSERT OR IGNORE INTO completed_challenge_languages
            (completed_challenge_id, language)
          VALUES (?, ?)
        `).run(row.id, lang);
      }
    };

    const selectAllChallengeIds = (db) => {
      const rows = db.prepare(`SELECT id FROM challenges`).all();
      return { ids: new Set(rows.map((r) => r.id)) };
    };

    const response = await saveCompletedChallengesSafeSync(
      db,
      userId,
      { username: 'TestUser' },
      {
        getUserCompleted,
        getCodeChallenge,
        insertChallengeSync,
        insertCompletedChallengeSync,
        selectAllChallengeIds,
      },
    );

    const challenges = db.prepare(`SELECT * FROM challenges`).all();
    const completed = db.prepare(`SELECT * FROM completed_challenges`).all();
    const languages = db.prepare(
      `SELECT * FROM completed_challenge_languages`,
    ).all();

    assert.equal(response.success, true);
    assert.equal(response.savedCount, 2);
    assert.equal(response.total, 2);
    assert.deepEqual(response.errors, null);

    assert.equal(challenges.length, 2);
    assert.equal(completed.length, 2);
    assert.equal(languages.length, 3);
  } finally {
    db.close();
  }
});
