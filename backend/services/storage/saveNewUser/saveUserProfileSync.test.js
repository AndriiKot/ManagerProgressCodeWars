'use strict';
import { DatabaseSync } from 'node:sqlite';
import { saveUserProfileSync } from './saveUserProfileSync.js';

const db = new DatabaseSync(':memory:');

db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    name TEXT,
    honor INTEGER DEFAULT 0,
    clan TEXT,
    leaderboard_position INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  ) STRICT
`);

const profile1 = {
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

if (row1.username === profile1.username && row1.honor === profile1.honor) {
  console.log('✅ Insert successful');
} else {
  console.error('❌ Insert failed');
}

const profile2 = {
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
  row2.leaderboard_position === profile2.leaderboardPosition
) {
  console.log('✅ Update successful');
} else {
  console.error('❌ Update failed');
}
