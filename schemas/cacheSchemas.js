import { USER_NAME } from "../config.js";

export const CACHE_SCHEMAS = {
  Ranks: {
    userDir: () => `${USER_NAME}`,
    file: () => `ranks.json`,
    field: "CryptoHash",
    useCryptoHash: true,
  },
  Position: {
    userDir: () => `${USER_NAME}`,
    file: () => `position.json`,
    field: "leaderboardPosition",
  },
  AuthoredKatasCount: {
    userDir: () => `${USER_NAME}`,
    file: () => `authored-katas-count.json`,
    field: "totalAuthored",
  },
  Honor: {
    userDir: () => `${USER_NAME}`,
    file: () => `honor.json`,
    field: "honor",
  },
  UniquesKatas: {
    userDir: () => `${USER_NAME}`,
    file: () => `uniques-katas-count.json`,
    field: "totalCompleted",
  },
  PagesCodeChallenges: {
    userDir: () => `${USER_NAME}`,
    file: () => `pages-code-challenges.json`,
    useCryptoHash: true,
  },
  KatasCodeChallenges: {
    userDir: () => `${USER_NAME}`,
    file: () => `katas-code-challenges.json`,
    useCryptoHash: true,
  },
};
