'use strict';
import { DatabaseSync } from 'node:sqlite';
import { saveUserRanksSync } from './saveUserRanksSync.js';

function runTests() {
  const db = new DatabaseSync(':memory:');

  try {
    console.log('=== Creating tables ===');
    db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        codewars_id TEXT UNIQUE
      );

      CREATE TABLE ranks (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        color TEXT NOT NULL
      );

      CREATE TABLE user_ranks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        scope TEXT NOT NULL CHECK(scope IN ('overall', 'language')),
        language TEXT,
        rank_id INTEGER NOT NULL REFERENCES ranks(id),
        score INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, scope, language),
        CHECK (
          (scope = 'overall' AND language = '') OR
          (scope = 'language' AND language <> '')
        )
      );
    `);

    db.exec(`
      INSERT INTO ranks (id, name, color) VALUES
        (-4, '4 kyu', 'blue'),
        (-5, '5 kyu', 'yellow');
    `);

    db.prepare(`INSERT INTO users (username, codewars_id) VALUES (?, ?)`).run('User1', 'U123');

    console.log('=== Insert overall + languages ===');
    const data1 = {
      overall: { rank: -4, score: 1600 },
      languages: {
        javascript: { rank: -4, score: 1400 },
        sql: { rank: -5, score: 300 }
      }
    };
    saveUserRanksSync(db, 'U123', data1);

    const rows1 = db.prepare(`SELECT scope, language, rank_id, score FROM user_ranks ORDER BY scope, language`).all();
    console.log('Rows:', rows1);

    console.log('=== Update overall rank ===');
    saveUserRanksSync(db, 'U123', { overall: { rank: -5, score: 2500 } });
    const overall2 = db.prepare(`SELECT rank_id, score FROM user_ranks WHERE scope='overall'`).get();
    console.log('Row:', overall2);

    console.log('=== Test missing user ===');
    try {
      saveUserRanksSync(db, 'NO_SUCH_USER', { overall: { rank: -4, score: 100 } });
    } catch (err) {
      console.log('✅ Error thrown:', err.message);
    }

  } finally {
    db.close();
    console.log('Database closed');
  }
}

runTests();
