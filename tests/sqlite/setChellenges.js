import fs from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

import { sqlite } from '#db';
import { CHALLENGES_RANKED } from '#config';

const { insertChallengeSync } = sqlite;
const db = new DatabaseSync('database-test.sqlite');

if (
  !fs.existsSync(CHALLENGES_RANKED) ||
  !fs.statSync(CHALLENGES_RANKED).isDirectory()
) {
  throw new Error(`Directory not found: ${CHALLENGES_RANKED}`);
}

const files = fs.readdirSync(CHALLENGES_RANKED);

files.forEach((file) => {
  const fullPath = join(CHALLENGES_RANKED, file);
  if (!fs.statSync(fullPath).isFile()) return;

  let content;
  try {
    content = fs.readFileSync(fullPath, 'utf-8');
  } catch (err) {
    console.error(`Error reading file ${fullPath}:`, err.message);
    return;
  }

  let serialize;
  try {
    serialize = JSON.parse(content);
  } catch (err) {
    console.error(`Error parsing JSON file ${fullPath}:`, err.message);
    return;
  }

  try {
    insertChallengeSync(db, serialize);
    console.log(`Inserted challenge ${serialize.id}`);
  } catch (err) {
    console.error(`Error inserting challenge ${serialize.id}:`, err.message);
  }
});
