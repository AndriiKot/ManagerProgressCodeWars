'use strict';

import { join } from 'node:path';
import { sqlite } from '#db';
import { CHALLENGES_DIR, DB_SCHEMAS } from '#config';
import { logger } from '#utils';

const { seedChallenges, insertChallengeSync, prepareDatabase } = sqlite;

export const bootstrapTestDatabase = (filename = 'test.sqlite') => {
  const testDbFile = join(process.cwd(), filename);

  let db;
  try {
    db = prepareDatabase(testDbFile, DB_SCHEMAS);
  } catch (err) {
    logger.error('Failed to prepare test database', {
      file: testDbFile,
      error: err?.message,
    });
    return null;
  }

  let count = 0;
  try {
    const row = db
      .prepare('SELECT total_challenges AS c FROM counts LIMIT 1')
      .get();
    count = row?.c ?? 0;
  } catch {
    logger.warn(
      "Table 'counts' or column 'total_challenges' does not exist yet, assuming 0 challenges."
    );
    count = 0;
  }

  const hasChallenges = count > 0;

  if (!hasChallenges) {
    try {
      logger.info('Seeding test challenges', { directory: CHALLENGES_DIR });
      seedChallenges(db, CHALLENGES_DIR, insertChallengeSync);
    } catch (err) {
      logger.error('Failed to seed test challenges', {
        error: err?.message,
      });
    }
  } else {
    logger.info('Skipping seed', {
      count,
      database: 'test',
    });
  }

  return db;
};
