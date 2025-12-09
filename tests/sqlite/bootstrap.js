import { join } from "node:path";
import { sqlite } from "#db";
import { DB_SCHEMAS } from "#config";

const { seedChallenges, insertChallengeSync, prepareDatabase } = sqlite;
const CHALLENGES_DIR = './test-db';
 
export const bootstrapDatabase = () => {

  const db = prepareDatabase('./test-challenges-db.sqlite', DB_SCHEMAS);

  seedChallenges(db, CHALLENGES_DIR, insertChallengeSync);

  return db;
};

bootstrapDatabase();


