export const PROFILE_SCHEMA = {
  Ranks: { path: "ranks", useCryptoHash: true },
  Position: { path: "leaderboardPosition", useCryptoHash: false },
  AuthoredKatas: { path: "codeChallenges.totalAuthored", useCryptoHash: false },
  Honor: { path: "honor", useCryptoHash: false },
  UniquesKatas: { path: "codeChallenges.totalCompleted", useCryptoHash: false },
};
