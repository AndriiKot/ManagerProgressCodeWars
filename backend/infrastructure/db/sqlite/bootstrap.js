import { join } from "node:path";
import { sqlite } from "#db";
import { CHALLENGES_DIR, DB_SCHEMAS } from "#config";

const { seedChallenges, insertChallengeSync, initDatabase } = sqlite;

export const bootstrapDatabase = () => {

  const db = initDatabase();

  seedChallenges(db, CHALLENGES_DIR, insertChallengeSync);

  return db;
};

bootstrapDatabase();

