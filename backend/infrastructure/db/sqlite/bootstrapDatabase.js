import { join } from "node:path";
import { sqlite } from "#db";
import { CHALLENGES_DIR, DB_SCHEMAS, DB_FILE } from "#config";

const { seedChallenges, insertChallengeSync, prepareDatabase } = sqlite;

export const bootstrapDatabase = () => {

  const db = prepareDatabase(DB_FILE, DB_SCHEMAS);

  seedChallenges(db, CHALLENGES_DIR, insertChallengeSync);

  return db;
};

