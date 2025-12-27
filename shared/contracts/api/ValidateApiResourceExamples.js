'use strict';

export const ValidateApiResourceExamples = {
  getUserProfile: {
    success: true,
    url: 'https://www.codewars.com/api/v1/users/{username}',
    data: {
      id: 'string',
      username: 'string',
      name: 'string',
      honor: 0,
      clan: 'string',
      leaderboardPosition: 0,
      skills: [],
      ranks: {
        overall: { rank: 0, name: 'string' },
        languages: {}
      },
      codeChallenges: { totalAuthored: 0, totalCompleted: 0 }
    },
    error: null,
    isValid: true,
    validationErrors: null
  },
  getCodeChallenge: {
    success: true,
    url: 'https://www.codewars.com/api/v1/code-challenges/{idOrSlug}',
    data: {
      id: 'string',
      name: 'string',
      description: 'string',
      ranks: {},
      languages: [],
      tags: []
    },
    error: null,
    isValid: true,
    validationErrors: null
  },
  getUserAuthored: {
    success: true,
    url: 'https://www.codewars.com/api/v1/users/{username}/code-challenges/authored',
    data: {
      totalAuthored: 0,
      challenges: []
    },
    error: null,
    isValid: true,
    validationErrors: null
  }
};

