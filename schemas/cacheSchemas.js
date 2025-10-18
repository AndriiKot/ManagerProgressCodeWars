import { USER_NAME } from "../config.js";

export const CACHE_SCHEMAS = {
  Ranks: { file: () => `user-ranks-${USER_NAME}.hash.json`, field: "CryptoHash", useCryptoHash: true },
  Position: { file: () => `user-position-${USER_NAME}.json`, field: "leaderboardPosition" },
  AuthoredKatas: { file: () => `user-authored-katas-${USER_NAME}.json`, field: "totalAuthored" },
  Honor: { file: () => `user-honor-${USER_NAME}.json`, field: "honor" },
  UniquesKatas: { file: () => `user-uniques-katas-${USER_NAME}.json`, field: "totalCompleted" },
};

