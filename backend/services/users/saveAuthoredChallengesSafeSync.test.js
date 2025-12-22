'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';

import { saveAuthoredChallengesSafeSync } from './saveAuthoredChallengesSafeSync.js';

test('saveAuthoredChallengesSafeSync saves authored challenges', async () => {
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

      CREATE TABLE authored_challenges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        challenge_id TEXT NOT NULL,
        UNIQUE(user_id, challenge_id)
      ) STRICT;
    `);

    const userId = db
      .prepare(`INSERT INTO users (username) VALUES (?)`)
      .run('TestUser').lastInsertRowid;

    const getUserAuthored = async () => ({
      success: true,
      isValid: true,
      data: {
        data: [
          { id: 'x1' },
          { id: 'y2' },
        ],
      },
    });

    const getCodeChallenge = async (id) => ({
      success: true,
      isValid: true,
      data: { id, name: `Challenge ${id}` },
    });

    const insertChallengeSync = (db, ch) => {
      db.prepare(`INSERT INTO challenges (id, name) VALUES (?, ?)`).run(ch.id, ch.name);
    };

    const insertAuthoredChallengeSync = (db, userId, challengeId) => {
      db.prepare(`
        INSERT OR IGNORE INTO authored_challenges
          (user_id, challenge_id)
        VALUES (?, ?)
      `).run(userId, challengeId);
    };

    const selectAllChallengeIds = (db) => {
      const rows = db.prepare(`SELECT id FROM challenges`).all();
      return new Set(rows.map(r => r.id));
    };

    const response = await saveAuthoredChallengesSafeSync(
      db,
      userId,
      { username: 'TestUser' },
      {
        getUserAuthored,
        getCodeChallenge,
        insertChallengeSync,
        insertAuthoredChallengeSync,
        selectAllChallengeIds,
      },
    );

    const challenges = db.prepare(`SELECT * FROM challenges`).all();
    const authored = db.prepare(`SELECT * FROM authored_challenges`).all();

    assert.equal(response.success, true);
    assert.equal(response.savedCount, 2);
    assert.equal(response.total, 2);
    assert.equal(response.errors, null);

    assert.equal(challenges.length, 2);
    assert.equal(authored.length, 2);
  } finally {
    db.close();
  }
});
