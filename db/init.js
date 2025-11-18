'use strict';

import fs from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite'; // Import DatabaseSync
import { DB } from '#config';

const DB_FILE = join(DB, 'database.sqlite');

export const initDatabase = () => { // Remove async - methods are synchronous
  const dbExists = fs.existsSync(DB_FILE);

  // Use DatabaseSync constructor instead of sqlite.openDatabase()
  const db = new DatabaseSync(DB_FILE, {
    enableForeignKeyConstraints: true // Set via option instead of PRAGMA
  });

  if (!dbExists) {
    const schemaSQL = fs.readFileSync(join(DB, 'schema.sql'), 'utf8');
    db.exec(schemaSQL); // Remove await - method is synchronous
    console.log('Database created and schema applied!');
  } else {
    console.log('Database exists, skipping schema creation.');
  }

  return db;
};