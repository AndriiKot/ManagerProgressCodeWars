import { USER_NAME } from "../config.js";

export const CACHE_SCHEMAS = {
  Ranks: {
    userDir: () => `${USER_NAME}`,
    file: () => `user-ranks-${USER_NAME}.hash.json`,
    field: "CryptoHash",
    useCryptoHash: true,
  },
  Position: {
    userDir: () => `${USER_NAME}`,
    file: () => `user-position-${USER_NAME}.json`,
    field: "leaderboardPosition",
  },
  AuthoredKatasCount: {
    userDir: () => `${USER_NAME}`,
    file: () => `user-authored-katas-count-${USER_NAME}.json`,
    field: "totalAuthored",
  },
  Honor: {
    userDir: () => `${USER_NAME}`,
    file: () => `user-honor-${USER_NAME}.json`,
    field: "honor",
  },
  UniquesKatas: {
    userDir: () => `${USER_NAME}`,
    file: () => `user-uniques-katas-${USER_NAME}.json`,
    field: "totalCompleted",
  },
};
