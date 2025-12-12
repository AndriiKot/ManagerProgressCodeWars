'use strict';

import { DatabaseSync } from 'node:sqlite';
import { selectAllUsersSlugsAndIds } from './selectAllUsersSlugsAndIds.js';

function runTest() {
  const db = new DatabaseSync(':memory:');

  try {
    console.log('=== Creating users table ===');

    db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        codewars_id TEXT UNIQUE NOT NULL,
        name TEXT,
        honor INTEGER DEFAULT 0,
        clan TEXT,
        leaderboard_position INTEGER,
        total_completed INTEGER DEFAULT 0,
        total_authored INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('=== Table created ===');

    db.exec(`
      INSERT INTO users (slug, codewars_id, name) VALUES
      ('user1', 'cw1', 'User One'),
      ('user2', 'cw2', 'User Two'),
      ('user3', 'cw3', 'User Three');
    `);

    console.log('=== Data inserted ===');

    const { slugs, ids } = selectAllUsersSlugsAndIds(db);
    console.log('Fetched slugs:', slugs);
    console.log('Fetched ids:', ids);

    // EXPECTED
    const expectedSlugs = ['user1', 'user2', 'user3'];
    const expectedIds = ['cw1', 'cw2', 'cw3'];

    const slugsCorrect = expectedSlugs.every(s => slugs.has(s)) && slugs.size === expectedSlugs.length;
    const idsCorrect = expectedIds.every(i => ids.has(i)) && ids.size === expectedIds.length;

    if (slugsCorrect && idsCorrect) {
      console.log('✅ selectAllUsersSlugsAndIds test passed');
    } else {
      console.error('❌ selectAllUsersSlugsAndIds test failed');
      console.error('Expected slugs:', expectedSlugs);
      console.error('Got slugs:', [...slugs]);
      console.error('Expected ids:', expectedIds);
      console.error('Got ids:', [...ids]);
    }

  } finally {
    db.close();
    console.log('✅ Database connection closed');
  }
}

runTest();
