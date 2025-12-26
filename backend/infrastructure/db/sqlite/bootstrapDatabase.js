'use strict';

import { sqlite } from '#db';
import { CHALLENGES_RANKED, DB_SCHEMAS, DB_FILE } from '#config';
import { logger } from '#utils';

const { seedChallenges, insertChallengeSync, prepareDatabase } = sqlite;

export const bootstrapDatabase = () => {
  let db;

  try {
    db = prepareDatabase(DB_FILE, DB_SCHEMAS);
  } catch (err) {
    logger.error('Failed to prepare database', {
      file: DB_FILE,
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
      "Table 'counts' or column 'total_challenges' does not exist yet, assuming 0 challenges.",
    );
    count = 0;
  }

  const hasChallenges = count > 0;

  if (!hasChallenges) {
    try {
      logger.info('Seeding challenges', {
        directory: CHALLENGES_RANKED,
      });
      seedChallenges(db, CHALLENGES_DIR, insertChallengeSync);
    } catch (err) {
      logger.error('Failed to seed challenges', {
        error: err?.message,
      });
    }
  } else {
    logger.info('Skipping seed', {
      count,
      database: 'main',
    });
  }

  return db;
};
