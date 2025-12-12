'use strict';

import { DatabaseSync } from 'node:sqlite';
import { selectAllChallengeIds } from './selectAllChallengeIds.js';

function runTest() {
  const db = new DatabaseSync(':memory:');

  try {
    console.log('=== Creating challenges table ===');

    db.exec(`
      CREATE TABLE challenges (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);

    console.log('=== Table created ===');

    db.exec(`
      INSERT INTO challenges (id, name) VALUES
      ('id1', 'Challenge 1'),
      ('id2', 'Challenge 2'),
      ('id3', 'Challenge 3');
    `);

    console.log('=== Data inserted ===');

    const ids = selectAllChallengeIds(db);
    console.log('Fetched IDs:', ids);

    // EXPECTED
    const expectedIds = ['id1', 'id2', 'id3'];

    const allFound = expectedIds.every(id => ids.has(id));
    const sizeCorrect = ids.size === expectedIds.length;

    if (allFound && sizeCorrect) {
      console.log('✅ selectAllChallengeIds test passed');
    } else {
      console.error('❌ selectAllChallengeIds test failed');
      console.error('Expected:', expectedIds);
      console.error('Got:', [...ids]);
    }

  } finally {
    db.close();
    console.log('✅ Database connection closed');
  }
}

runTest();
