import { deepFreezeArray } from "#shared-utils";

export const ProfileSimpleFields = deepFreezeArray([
  "honor",
  "clan",
  "leaderboardPosition",
  "codeChallenges.totalAuthored",
  "codeChallenges.totalCompleted",
]);
