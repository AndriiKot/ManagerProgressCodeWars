'use strict';

import { DatabaseSync } from 'node:sqlite';
import { saveFullUser } from './saveFullUser.js';
import { sqlite } from '#db';

const {
  insertUserProfileSync,
  insertUserRanksSync,
  insertUserSkillsSync
} = sqlite;

function createSchema(db) {
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      name TEXT,
      honor INTEGER,
      clan TEXT,
      leaderboard_position INTEGER,
      total_completed INTEGER,
      total_authored INTEGER,
      codewars_id TEXT UNIQUE,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    ) STRICT
  `);

  db.exec(`
    CREATE TABLE user_ranks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      language TEXT NOT NULL,
      rank INTEGER,
      score INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, language)
    ) STRICT
  `);

  db.exec(`
    CREATE TABLE user_skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      skill TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, skill)
    ) STRICT
  `);
}

function runTests() {
  const db = new DatabaseSync(':memory:');

  try {
    createSchema(db);

    const profile = {
      id: '123456',
      username: 'TestUser',
      name: 'User Name',
      honor: 150,
      clan: 'DevClan',
      leaderboardPosition: 123,
      codeChallenges: {
        totalCompleted: 50,
        totalAuthored: 1
      },
      ranks: {
        javascript: { rank: -2, score: 120 },
        python: { rank: -3, score: 80 }
      },
      skills: ['Promises', 'Recursion', 'OOP']
    };

    console.log('Running saveFullUser test');

    const userId = saveFullUser(db, profile);

    const user = db.prepare(
      `SELECT * FROM users WHERE id = ?`
    ).get(userId);

    console.log('User row:', user);

    if (
      user.username === profile.username &&
      user.codewars_id === profile.id &&
      user.total_completed === profile.codeChallenges.totalCompleted
    ) {
      console.log('User inserted correctly');
    } else {
      console.error('User insert error');
    }

    const ranks = db.prepare(
      `SELECT language, rank, score FROM user_ranks WHERE user_id = ? ORDER BY language`
    ).all(userId);

    console.log('Ranks:', ranks);

    if (ranks.length === 2) {
      console.log('Ranks inserted correctly');
    } else {
      console.error('Ranks insert error');
    }

    const skills = db.prepare(
      `SELECT skill FROM user_skills WHERE user_id = ? ORDER BY skill`
    ).all(userId);

    console.log('Skills:', skills);

    if (skills.length === 3) {
      console.log('Skills inserted correctly');
    } else {
      console.error('Skills insert error');
    }

  } finally {
    db.close();
    console.log('DB closed');
  }
}

runTests();
