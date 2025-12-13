'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';

import { saveAuthoredChallengesSafeSync } from './saveAuthoredChallengesSafeSync.js';
import { SaveAuthoredResponse } from '#contracts';

test('saveAuthoredChallengesSafeSync saves challenges and links', async () => {
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
        user_id INTEGER NOT NULL,
        challenge_id TEXT NOT NULL,
        UNIQUE(user_id, challenge_id)
      ) STRICT;
    `);

    const userId = db
      .prepare(`INSERT INTO users (username) VALUES (?)`)
      .run('TestUser').lastInsertRowid;

    // ===== MOCKS =====
    const fetchUserAuthored = async () => ({
      success: true,
      isValid: true,
      data: {
        data: [{ id: 'a1' }, { id: 'b2' }],
      },
    });

    const fetchCodeChallenge = async (id) => ({
      success: true,
      isValid: true,
      data: { id, name: `Challenge ${id}` },
    });

    const insertChallengeSync = (db, ch) => {
      db.prepare(
        `INSERT INTO challenges (id, name) VALUES (?, ?)`
      ).run(ch.id, ch.name);
    };

    const insertAuthoredChallengeSync = (db, userId, challengeId) => {
      db.prepare(
        `INSERT OR IGNORE INTO authored_challenges (user_id, challenge_id)
         VALUES (?, ?)`
      ).run(userId, challengeId);
    };

    const selectAllChallengeIds = (db) => {
      const rows = db.prepare(`SELECT id FROM challenges`).all();
      return { ids: new Set(rows.map(r => r.id)) };
    };

    const response = await saveAuthoredChallengesSafeSync(
      db,
      userId,
      { username: 'TestUser' },
      {
        fetchUserAuthored,
        fetchCodeChallenge,
        insertAuthoredChallengeSync,
        insertChallengeSync,
        selectAllChallengeIds,
      }
    );

    const challenges = db.prepare(`SELECT * FROM challenges`).all();
    const authored = db.prepare(`SELECT * FROM authored_challenges`).all();

    assert.equal(response.success, true);
    assert.equal(response.savedCount, 2);
    assert.equal(response.total, 2);
    assert.deepEqual(response.errors, null);

    assert.equal(challenges.length, 2);
    assert.equal(authored.length, 2);

  } finally {
    db.close();
  }
});
