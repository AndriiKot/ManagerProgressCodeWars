'use strict';
import { DatabaseSync } from 'node:sqlite';
import { saveUserProfileSync } from './saveUserProfileSync.js';

function runTests() {
  const db = new DatabaseSync(':memory:');

  try {
    db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        name TEXT,
        honor INTEGER DEFAULT 0,
        clan TEXT,
        leaderboard_position INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        codewars_id TEXT UNIQUE
      ) STRICT
    `);

    const profile1 = {
      id: '65414e312c58d11519d2aa31',
      username: 'Krillan',
      name: 'Krillan Name',
      honor: 29700,
      clan: 'TestClan',
      leaderboardPosition: 175
    };

    let id1 = saveUserProfileSync(db, profile1);
    let row1 = db.prepare('SELECT * FROM users WHERE id = ?').get(id1);

    console.log('--- Insert ---');
    console.log('ID:', id1);
    console.log('Row:', row1);

    if (row1.username === profile1.username && 
        row1.honor === profile1.honor && 
        row1.codewars_id === profile1.id) {
      console.log('✅ Insert successful');
    } else {
      console.error('❌ Insert failed');
      console.log('Expected codewars_id:', profile1.id);
      console.log('Actual codewars_id:', row1.codewars_id);
    }

    const profile2 = {
      id: '65414e312c58d11519d2aa31',
      username: 'Krillan',
      name: 'Krillan Updated',
      honor: 30000,
      clan: 'TestClanUpdated',
      leaderboardPosition: 180
    };

    let id2 = saveUserProfileSync(db, profile2);
    let row2 = db.prepare('SELECT * FROM users WHERE id = ?').get(id2);

    console.log('--- Update ---');
    console.log('ID:', id2);
    console.log('Row:', row2);

    if (
      row2.name === profile2.name &&
      row2.honor === profile2.honor &&
      row2.clan === profile2.clan &&
      row2.leaderboard_position === profile2.leaderboardPosition &&
      row2.codewars_id === profile2.id
    ) {
      console.log('✅ Update successful');
    } else {
      console.error('❌ Update failed');
    }

    const profile3 = {
      id: '65414e312c58d11519d2aa31',
      username: 'Krillan',
      name: null,
      honor: null,
      clan: null,
      leaderboardPosition: null
    };

    let id3 = saveUserProfileSync(db, profile3);
    let row3 = db.prepare('SELECT * FROM users WHERE id = ?').get(id3);

    console.log('--- Update with nulls (COALESCE test) ---');
    console.log('ID:', id3);
    console.log('Row:', row3);

    if (
      row3.name === profile2.name &&
      row3.honor === profile2.honor &&
      row3.clan === profile2.clan &&
      row3.leaderboard_position === profile2.leaderboardPosition
    ) {
      console.log('✅ COALESCE test successful - old values preserved');
    } else {
      console.error('❌ COALESCE test failed');
    }

    const profile4 = {
      id: '1234567890abcdef12345678',
      username: 'NewUser',
      name: 'New User Name',
      honor: 1000,
      clan: 'NewClan',
      leaderboardPosition: 50000
    };

    let id4 = saveUserProfileSync(db, profile4);
    let row4 = db.prepare('SELECT * FROM users WHERE id = ?').get(id4);

    console.log('--- New user with different codewars_id ---');
    console.log('ID:', id4);
    console.log('Row:', row4);

    if (row4.username === profile4.username && row4.codewars_id === profile4.id) {
      console.log('✅ New user insert successful');
    } else {
      console.error('❌ New user insert failed');
    }

  } finally {
    db.close();
    console.log('✅ Database connection closed, memory freed');
  }
}

runTests();
