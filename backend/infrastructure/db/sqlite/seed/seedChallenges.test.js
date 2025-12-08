'use strict';

import fs from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { seedChallenges } from './seedChallenges.js';

// --- mock insertFn ---
function mockInsertFn(db, challenge) {
  db.prepare(`
    INSERT INTO challenges (id, name)
    VALUES (?, ?)
  `).run(challenge.id, challenge.name);
}

function runSeedChallengesTests() {
  const db = new DatabaseSync(':memory:');

  try {
    // ====== CREATE TABLE ======
    db.exec(`
      CREATE TABLE challenges (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      ) STRICT;
    `);

    // ====== Prepare mock JSON files ======
    const tmpDir = './tmp_challenges';
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const files = [
      { id: 'c1', name: 'Challenge 1' },
      { id: 'c2', name: 'Challenge 2' }
    ];

    files.forEach((f, i) => {
      fs.writeFileSync(join(tmpDir, `challenge${i}.json`), JSON.stringify(f));
    });

    // ====== RUN seedChallenges ======
    seedChallenges(db, tmpDir, mockInsertFn);

    // ====== VERIFY ======
    const rows = db.prepare('SELECT * FROM challenges ORDER BY id').all();
    console.log('Inserted challenges:', rows);

    console.assert(rows.length === files.length, '❌ Not all challenges inserted');
    console.assert(rows[0].id === 'c1', '❌ First challenge mismatch');
    console.assert(rows[1].id === 'c2', '❌ Second challenge mismatch');

    console.log('✅ All seedChallenges tests passed');

    // ====== CLEANUP ======
    fs.rmSync(tmpDir, { recursive: true, force: true });

  } finally {
    db.close();
  }
}

runSeedChallengesTests();
