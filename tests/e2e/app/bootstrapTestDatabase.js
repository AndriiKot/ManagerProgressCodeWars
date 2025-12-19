import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { sqlite } from '#db';
import { CHALLENGES_DIR, DB_SCHEMAS } from '#config';

const { seedChallenges, insertChallengeSync, prepareDatabase } = sqlite;

export const bootstrapTestDatabase = (filename = 'test.sqlite') => {
  const testDbFile = join(process.cwd(), filename);

  let db;
  try {
    db = prepareDatabase(testDbFile, DB_SCHEMAS);
  } catch (err) {
    console.error('Failed to prepare test database:', err);
    return null;
  }

  // Проверяем, есть ли уже челленджи
  let count = 0;
  try {
    const row = db
      .prepare('SELECT total_challenges AS c FROM counts LIMIT 1')
      .get();
    count = row?.c ?? 0;
  } catch (err) {
    console.warn(
      "Table 'counts' or column 'total_challenges' does not exist yet, assuming 0 challenges."
    );
    count = 0;
  }

  const hasChallenges = count > 0;

  if (!hasChallenges) {
    try {
      console.log('Seeding test challenges…');
      seedChallenges(db, CHALLENGES_DIR, insertChallengeSync);
    } catch (err) {
      console.error('Failed to seed test challenges:', err);
    }
  } else {
    console.log(`Skipping seed — ${count} challenges already exist in test DB`);
  }

  return db;
};
