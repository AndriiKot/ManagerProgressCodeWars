'use strict';


export const getProfile = (username) =>
  `https://www.codewars.com/api/v1/users/${username}`;

export const getCompletedChallenges = (username) =>
    `https://www.codewars.com/api/v1/users/${username}/code-challenges/completed`;

export const getAuthoredChallenges = (username) =>
    `https://www.codewars.com/api/v1/users/${username}/code-challenges/authored`;


export const challenges = {
  getById: (idOrSlug) =>
    `https://www.codewars.com/api/v1/code-challenges/${idOrSlug}`
};
