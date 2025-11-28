'use strict';

import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

export const prepareDatabase = (dbFilePath, schemasFilePath) => { 
  const dbExists = fs.existsSync(dbFilePath);

  const db = new DatabaseSync(dbFilePath, {
    enableForeignKeyConstraints: true 
  });

  if (!dbExists) {
    const schemaSQL = fs.readFileSync(schemasFilePath, 'utf8');
    db.exec(schemaSQL); 
    console.log('Database created and schema applied!');
  } else {
    console.log('Database exists, skipping schema creation.');
  }

  return db;
};
