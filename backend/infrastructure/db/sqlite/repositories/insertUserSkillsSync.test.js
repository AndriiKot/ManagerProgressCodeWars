'use strict';

import { DatabaseSync } from 'node:sqlite';
import { insertUserSkillsSync } from './insertUserSkillsSync.js';

function runSkillsTests() {
  const db = new DatabaseSync(':memory:');

  try {
    db.exec(`
      CREATE TABLE user_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        skill TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, skill)
      ) STRICT
    `);

    const userId = 1;
    const skills1 = ['JavaScript', 'SQL', 'Python'];

    insertUserSkillsSync(db, userId, skills1);
    const rows1 = db.prepare('SELECT skill FROM user_skills WHERE user_id = ? ORDER BY skill').all(userId);
    console.log('--- Insert skills ---');
    console.log('Rows:', rows1.map(r => r.skill));
    console.log(rows1.length === skills1.length ? '✅ Passed' : '❌ Failed');

    insertUserSkillsSync(db, userId, skills1);
    const rows2 = db.prepare('SELECT skill FROM user_skills WHERE user_id = ? ORDER BY skill').all(userId);
    console.log('--- Insert duplicate skills ---');
    console.log('Rows:', rows2.map(r => r.skill));
    console.log(rows2.length === skills1.length ? '✅ Passed' : '❌ Failed');

    const skills2 = ['Ruby', 'C++'];
    insertUserSkillsSync(db, userId, skills2);
    const rows3 = db.prepare('SELECT skill FROM user_skills WHERE user_id = ? ORDER BY skill').all(userId);
    console.log('--- Add more skills ---');
    console.log('Rows:', rows3.map(r => r.skill));
    console.log(rows3.length === skills1.length + skills2.length ? '✅ Passed' : '❌ Failed');

  } finally {
    db.close();
    console.log('✅ Database connection closed');
  }
}

runSkillsTests();
