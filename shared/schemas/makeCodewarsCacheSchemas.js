import { join } from "node:path";
import { deepFreeze } from "#utils";

export const makeCodewarsCacheSchemas = (basePath) => {
  return deepFreeze({
    Ranks: {
      file: join(basePath, "ranks.json"),
      field: "CryptoHash",
      useCryptoHash: true,
    },
    Position: {
      file: join(basePath, "position.json"),
      field: "leaderboardPosition",
      useCryptoHash: false,
    },
    AuthoredKatasCount: {
      file: join(basePath, "authored-katas-count.json"),
      field: "totalAuthored",
      useCryptoHash: false,
    },
    Honor: {
      file: join(basePath, "honor.json"),
      field: "honor",
      useCryptoHash: false,
    },
    UniquesKatas: {
      file: join(basePath, "uniques-katas-count.json"),
      field: "totalCompleted",
      useCryptoHash: false,
    },
    PagesCodeChallenges: {
      file: join(basePath, "pages-code-challenges.json"),
      useCryptoHash: true,
    },
    KatasCodeChallenges: {
      file: join(basePath, "katas-code-challenges.json"),
      useCryptoHash: true,
    },
  });
};
