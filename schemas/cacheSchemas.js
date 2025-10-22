import { USER_NAME, CACHE_DIR_CODEWARS } from "../config.js";

export const CACHE_SCHEMAS = {
  CachePath: `${CACHE_DIR_CODEWARS}${USER_NAME}/`,
  Ranks: {
    file: "ranks.json",
    field: "CryptoHash",
    useCryptoHash: true,
  },
  Position: {
    file: "position.json",
    field: "leaderboardPosition",
  },
  AuthoredKatasCount: {
    file: "authored-katas-count.json",
    field: "totalAuthored",
  },
  Honor: {
    file: "honor.json",
    field: "honor",
  },
  UniquesKatas: {
    file: "uniques-katas-count.json",
    field: "totalCompleted",
  },
  PagesCodeChallenges: {
    file: "pages-code-challenges.json",
    useCryptoHash: true,
  },
  KatasCodeChallenges: {
    file: "katas-code-challenges.json",
    useCryptoHash: true,
  },
};
