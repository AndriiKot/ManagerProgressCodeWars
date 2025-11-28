import { deepFreezeArray } from '#utils';

export const ProfileSimpleFields = deepFreezeArray([
  'honor',
  'clan',
  'leaderboardPosition',
  'codeChallenges.totalAuthored',
  'codeChallenges.totalCompleted',
]);
