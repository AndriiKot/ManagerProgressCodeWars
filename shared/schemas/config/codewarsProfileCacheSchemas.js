import { join } from "node:path";
import { deepFreeze } from "#shared-utils";

export const CodewarsProfileCacheSchemas = deepFreeze({
  Honor: {
    field: "honor",
    useCryptoHash: false,
  },
  Clan: {
    field: "clan",
    useCryptoHash: false,
  },
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
});
