import { join } from "node:path";
import { deepFreeze } from "#shared-utils";

export const CodewarsProfileCacheSchemas = deepFreeze({
  fields: [
    "honor",
    "clan",
    "leaderboardPosition",
    "codeChallenges.totalAuthored",
    "codeChallenges.totalCompleted",
  ],
  fieldsUseHash: [
    ["ranks"],
    ["ranks.overall", "ranks.languages"],
  ],
});
