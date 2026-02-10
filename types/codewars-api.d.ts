declare module "#api" {
  export const CodewarsAPI: {
    getUserProfile(user: string): Promise<any>;

    getCompletedChallenges(
      user: string,
      pageNumber?: number
    ): Promise<any>;

    getAuthoredChallenges(user: string): Promise<any>;

    getChallenge(idOrSlug: string): Promise<any>;
  };
}
