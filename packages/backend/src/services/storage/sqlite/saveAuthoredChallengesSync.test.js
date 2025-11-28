'use strict';

import { DatabaseSync } from 'node:sqlite';
import { saveAuthoredChallengesSync } from './saveAuthoredChallengesSync.js';

function runTests() {
  const db = new DatabaseSync(':memory:');

  try {
    // ====== CREATE TABLES ======
    db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL
      ) STRICT;

      CREATE TABLE authored_challenges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        challenge_id TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, challenge_id)
      ) STRICT;
    `);

    // ====== CREATE TEST USER ======
    const userStmt = db.prepare(`INSERT INTO users (username) VALUES (?)`);
    const userId = userStmt.run('TestUser').lastInsertRowid;
    console.log('User created with id:', userId);

    // ====== TEST 1: INSERT MULTIPLE ======
    const authored1 = [
      { id: 'aaa111' },
      { id: 'bbb222' },
      { id: 'ccc333' }
    ];

    saveAuthoredChallengesSync(db, userId, authored1);

    const rows1 = db.prepare('SELECT challenge_id FROM authored_challenges ORDER BY challenge_id').all();
    console.log('--- Insert multiple ---', rows1);

    console.assert(rows1.length === 3, '❌ Insert multiple failed');

    // ====== TEST 2: INSERT DUPLICATES (IGNORE) ======
    const authored2 = [
      { id: 'bbb222' }, // duplicate
      { id: 'ddd444' }  // new
    ];

    saveAuthoredChallengesSync(db, userId, authored2);

    const rows2 = db.prepare('SELECT challenge_id FROM authored_challenges ORDER BY challenge_id').all();
    console.log('--- Insert duplicates ---', rows2);

    console.assert(rows2.length === 4 && rows2.some(r => r.challenge_id === 'ddd444'), '❌ Duplicate insert failed');

    // ====== TEST 3: EMPTY ARRAY ======
    saveAuthoredChallengesSync(db, userId, []);

    const rows3 = db.prepare('SELECT COUNT(*) AS c FROM authored_challenges').get();
    console.log('--- Empty insert ---', rows3);

    console.assert(rows3.c === 4, '❌ Empty array handling failed');

    // ====== TEST 4: ROLLBACK ON ERROR ======
    let errorThrown = false;

    const badData = [
      { id: 'xxx777' },
      { id: null }, // will break NOT NULL
      { id: 'yyy888' }
    ];

    try {
      saveAuthoredChallengesSync(db, userId, badData);
    } catch (e) {
      errorThrown = true;
      console.log('Expected error:', e.message);
    }

    const rows4 = db.prepare('SELECT challenge_id FROM authored_challenges').all();
    console.log('--- Transaction rollback ---', rows4);

    console.assert(errorThrown, '❌ Error should be thrown');
    console.assert(!rows4.some(r => r.challenge_id === 'xxx777'), '❌ Rollback failed, partial writes exist');

  } finally {
    db.close();
    console.log('✅ DB closed');
  }
}

runTests();
