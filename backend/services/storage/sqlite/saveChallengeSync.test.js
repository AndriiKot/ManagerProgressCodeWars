'use strict';

import { DatabaseSync } from 'node:sqlite';
import { saveChallengeSync } from './saveChallengeSync.js';

function runTests() {
  const db = new DatabaseSync(':memory:');

  try {
    console.log('=== Creating tables ===');

    db.exec(`
      CREATE TABLE challenges (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE,
        description TEXT,
        category TEXT,
        rank_id INTEGER DEFAULT 0,
        created_by_username TEXT,
        approved_by_username TEXT,
        total_attempts INTEGER DEFAULT 0,
        total_completed INTEGER DEFAULT 0,
        total_stars INTEGER DEFAULT 0,
        vote_score INTEGER DEFAULT 0,
        published_at TEXT,
        approved_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      ) STRICT
    `);

    db.exec(`
      CREATE TABLE challenge_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
        tag TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(challenge_id, tag)
      ) STRICT
    `);

    db.exec(`
      CREATE TABLE challenge_languages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
        language TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(challenge_id, language)
      ) STRICT
    `);

    console.log('=== Tables created ===');

    const challenge1 = {
      id: "651bfcbd409ea1001ef2c3cb",
      name: "Roguelike game 1 - stats and weapon",
      slug: "roguelike-game-1-stats-and-weapon",
      description: "Test description",
      category: "games",
      rank: { id: -5, name: "5 kyu" },
      createdBy: { username: "Krillan" },
      approvedBy: { username: "Blind4Basics" },
      totalAttempts: 4106,
      totalCompleted: 221,
      totalStars: 82,
      voteScore: 66,
      publishedAt: "2023-10-03T12:23:37.541Z",
      approvedAt: "2023-11-25T16:12:45.312Z",
      languages: ["javascript", "python", "ruby"],
      tags: ["Puzzles", "Games", "OOP"]
    };

    const id1 = saveChallengeSync(db, challenge1);
    const row1 = db.prepare('SELECT * FROM challenges WHERE id = ?').get(id1);

    console.log('--- Insert ---');
    console.log(row1);

    const tags1 = db.prepare('SELECT tag FROM challenge_tags WHERE challenge_id = ? ORDER BY tag').all(id1).map(r => r.tag);
    const langs1 = db.prepare('SELECT language FROM challenge_languages WHERE challenge_id = ? ORDER BY language').all(id1).map(r => r.language);

    console.log('Tags:', tags1);
    console.log('Languages:', langs1);

    if (tags1.length === challenge1.tags.length && langs1.length === challenge1.languages.length) {
      console.log('✅ Insert tags & languages successful');
    } else {
      console.error('❌ Insert tags & languages failed');
    }

    const challenge2 = { ...challenge1, name: "Updated name", description: "Updated desc" };
    const id2 = saveChallengeSync(db, challenge2);
    const row2 = db.prepare('SELECT * FROM challenges WHERE id = ?').get(id2);

    console.log('--- Update ---');
    console.log(row2);

    if (row2.name === "Updated name" && row2.description === "Updated desc") {
      console.log('✅ Update successful');
    } else {
      console.error('❌ Update failed');
    }

    const challenge3 = { ...challenge1, tags: ["Games", "NewTag"], languages: ["python", "Dart"] };
    saveChallengeSync(db, challenge3);

    const tags3 = db.prepare('SELECT tag FROM challenge_tags WHERE challenge_id = ? ORDER BY tag').all(id1).map(r => r.tag);
    const langs3 = db.prepare('SELECT language FROM challenge_languages WHERE challenge_id = ? ORDER BY language').all(id1).map(r => r.language);

    console.log('--- Tags after duplicate insert ---', tags3);
    console.log('--- Languages after duplicate insert ---', langs3);

    if (tags3.includes("NewTag") && langs3.includes("Dart") && tags3.filter(t => t === "Games").length === 1) {
      console.log('✅ Tags & Languages deduplication successful');
    } else {
      console.error('❌ Deduplication failed');
    }

  } finally {
    db.close();
    console.log('✅ Database connection closed');
  }
}

runTests();
