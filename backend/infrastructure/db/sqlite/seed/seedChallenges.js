'use strict';

import fs from 'node:fs';
import { join } from 'node:path';

export const seedChallenges = (db, challengesDir, insertFn) => {
  if (!fs.existsSync(challengesDir) || !fs.statSync(challengesDir).isDirectory()) {
    throw new Error(`Directory not found: ${challengesDir}`);
  }

  const files = fs.readdirSync(challengesDir);

  for (const file of files) {
    const fullPath = join(challengesDir, file);
    if (!fs.statSync(fullPath).isFile()) continue;

    let parsed;
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      parsed = JSON.parse(content);
    } catch (err) {
      console.error(`Error reading/parsing ${fullPath}:`, err.message);
      continue;
    }

    try {
      insertFn(db, parsed);
      console.log(`Inserted challenge ${parsed.id}`);
    } catch (err) {
      console.error(`Insert error ${parsed.id}:`, err.message);
    }
  }
};
