import { USER_NAME } from "../config.js";

export const CACHE_SCHEMAS = {
  Ranks: {
    dir: () => `${USER_NAME}`,
    file: () => `user-ranks-${USER_NAME}.hash.json`,
    field: "CryptoHash",
    useCryptoHash: true,
  },
  Position: {
    dir: () => `${USER_NAME}`,
    file: () => `user-position-${USER_NAME}.json`,
    field: "leaderboardPosition",
  },
  AuthoredKatasCount: {
    dir: () => `${USER_NAME}`,
    file: () => `user-authored-katas-count-${USER_NAME}.json`,
    field: "totalAuthored",
  },
  Honor: {
    dir: () => `${USER_NAME}`,
    file: () => `user-honor-${USER_NAME}.json`,
    field: "honor",
  },
  UniquesKatas: {
    dir: () => `${USER_NAME}`,
    file: () => `user-uniques-katas-${USER_NAME}.json`,
    field: "totalCompleted",
  },
};
