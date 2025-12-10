import { existsSync } from "node:fs";
import { sqlite } from "#db";
import { CHALLENGES_DIR, DB_SCHEMAS, DB_FILE } from "#config";

const { seedChallenges, insertChallengeSync, prepareDatabase } = sqlite;

export const bootstrapDatabase = () => {
  let db;

  try {
    db = prepareDatabase(DB_FILE, DB_SCHEMAS);
  } catch (err) {
    console.error("Failed to prepare database:", err);
    return null;
  }

  let count = 0;
  try {
    const row = db
      .prepare("SELECT total_challenges AS c FROM counts LIMIT 1")
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
      console.log("Seeding challenges…");
      seedChallenges(db, CHALLENGES_DIR, insertChallengeSync);
    } catch (err) {
      console.error("Failed to seed challenges:", err);
    }
  } else {
    console.log(`Skipping seed — ${count} challenges already exist`);
  }

  return db;
};

