/**
 * Schema for user profile fields
 */
export const PROFILE_SCHEMA = Object.freeze({
  Ranks: { path: "ranks", useCryptoHash: true },
  Position: { path: "leaderboardPosition", useCryptoHash: false },
  AuthoredKatas: { path: "codeChallenges.totalAuthored", useCryptoHash: false },
  Honor: { path: "honor", useCryptoHash: false },
  UniquesKatas: { path: "codeChallenges.totalCompleted", useCryptoHash: false },
});