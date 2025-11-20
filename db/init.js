'use strict';

import fs from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite'; 
import { DB } from '#config';

const DB_FILE = join(DB, 'database.sqlite');

export const initDatabase = () => { 
  const dbExists = fs.existsSync(DB_FILE);

  const db = new DatabaseSync(DB_FILE, {
    enableForeignKeyConstraints: true 
  });

  if (!dbExists) {
    const schemaSQL = fs.readFileSync(join(DB, 'schema.sql'), 'utf8');
    db.exec(schemaSQL); 
    console.log('Database created and schema applied!');
  } else {
    console.log('Database exists, skipping schema creation.');
  }

  return db;
};