import { join } from "node:path";
import { deepFreeze } from "#shared-utils";

export const CodewarsProfileCacheSchemas = deepFreeze({
  Ranks: {
    field: "ranks",
    useCryptoHash: true,
  },
  Position: {
    field: "leaderboardPosition",
    useCryptoHash: false,
  },
  AuthoredKatasCount: {
    field: "codeChallenges.totalAuthored",
    useCryptoHash: false,
  },
  UniquesKatas: {
    field: "codeChallenges.totalCompleted",
    useCryptoHash: false,
  },
  Honor: {
    field: "honor",
    useCryptoHash: false,
  },
});
