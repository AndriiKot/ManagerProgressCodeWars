'use strict';

export const API_CODEWARS_URL = {
  Users_API: (username) => `https://www.codewars.com/api/v1/users/${username}`,

  List_Completed_Challenges: (username, page) =>
    `https://www.codewars.com/api/v1/users/${username}/code-challenges/completed?page=${page}`,

  List_Authored_Challenges: (username) =>
    `https://www.codewars.com/api/v1/users/${username}/code-challenges/authored`,

  Code_Challenges_API: (idOrSlug) =>
    `https://www.codewars.com/api/v1/code-challenges/${idOrSlug}`,
};
