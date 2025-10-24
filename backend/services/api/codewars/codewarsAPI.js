"use strict";

import { retryFetchApiRequest } from "#api-utils";
import { API_CODEWARS_URL } from "./urls.js";

const {
  Users_API,
  List_Completed_Challenges,
  List_Authored_Challenges,
  Code_Challenges_API,
} = API_CODEWARS_URL;

/**
 * Provides convenient wrappers around Codewars API endpoints.
 *
 * Each method returns a Promise resolving to an object with:
 * `{ success: boolean, data: JsonValue | null, error: string | null }`
 *
 * @namespace CodewarsAPI
 */
export const CodewarsAPI = {
  /**
   * Fetch a Codewars user profile.
   * @param {string} user - The Codewars username.
   * @returns {Promise<{success: boolean, data: JsonValue | null, error: string | null}>}
   */
  getUserProfile: (user) => retryFetchApiRequest(Users_API(user)),

  /**
   * Fetch completed challenges for a user by page number.
   * @param {string} user - The Codewars username.
   * @param {number} [pageNumber=0] - Page number to fetch (0-based).
   * @returns {Promise<{success: boolean, data: JsonValue | null, error: string | null}>}
   */
  getCompletedChallenges: (user, pageNumber = 0) =>
    retryFetchApiRequest(List_Completed_Challenges(user, pageNumber)),

  /**
   * Fetch all pages of completed challenges for a user.
   * @param {string} user - The Codewars username.
   * @returns {Promise<Array<{success: boolean, data: JsonValue | null, error: string | null}>>}
   */
  getAllPagesCompletedChallenges: async (user) => {
    const firstPage = await retryFetchApiRequest(
      List_Completed_Challenges(user, 0)
    );
    let pages = [];
    if (firstPage.success) {
      const countPages = firstPage.data.totalPages;
      const urls = Array.from({ length: countPages }, (_, i) =>
        List_Completed_Challenges(user, i)
      );
      pages = await Promise.all(urls.map((url) => retryFetchApiRequest(url)));
    } else {
      console.warn(`Failed to fetch first page: ${firstPage.error}`);
    }
    return pages;
  },

  /**
   * Fetch challenges authored by a specific Codewars user.
   *
   * Each item in the `data` array describes an authored kata.
   * If the user has no authored challenges, `data` will be an empty array.
   *
   * @param {string} user - The Codewars username.
   * @returns {Promise<{
   *   success: boolean,
   *   data: {
   *     data: Array<{
   *       id: string,
   *       name: string,
   *       description: string,
   *       rank: number | null,
   *       rankName: string | null,
   *       tags: string[],
   *       languages: string[]
   *     }>
   *   } | null,
   *   error: string | null
   * }>}
   */
  getAuthoredChallenges: (user) =>
    retryFetchApiRequest(List_Authored_Challenges(user)),

  /**
   * Fetch information about a specific Codewars challenge.
   * @param {string} idOrSlug - Challenge ID or slug.
   * @returns {Promise<{success: boolean, data: JsonValue | null, error: string | null}>}
   */
  getChallenge: (idOrSlug) =>
    retryFetchApiRequest(Code_Challenges_API(idOrSlug)),
};
