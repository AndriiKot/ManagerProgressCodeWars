"use strict";

/**
 * Object containing functions to generate Codewars API URLs.
 * @namespace API_CODEWARS_URL
 */
export const API_CODEWARS_URL = {
  /** @param {string} username */
  Users_API: (username) => `https://www.codewars.com/api/v1/users/${username}`,

  /** @param {string} username @param {number} page */
  List_Completed_Challenges: (username, page) =>
    `https://www.codewars.com/api/v1/users/${username}/code-challenges/completed?page=${page}`,

  /** @param {string} username */
  List_Authored_Challenges: (username) =>
    `https://www.codewars.com/api/v1/users/${username}/code-challenges/authored`,

  /** @param {string} idOrSlug */
  Code_Challenges_API: (idOrSlug) =>
    `https://www.codewars.com/api/v1/code-challenges/${idOrSlug}`,
};
