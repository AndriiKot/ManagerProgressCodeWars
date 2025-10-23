'use strict';

import { retryApiRequest } from "#api-utils";
import { API_CODEWARS_URL } from "./urls.js";

const { Users_API, List_Completed_Challenges, List_Authored_Challenges, Code_Challenges_API } = API_CODEWARS_URL;

export const CodewarsAPI = {
  getUserProfile: (user) => retryApiRequest(Users_API(user)),
  getCompletedChallenges: (user, pageNumber = 0) => retryApiRequest(List_Completed_Challenges(user, pageNumber)),
  getAllPagesCompletedChallenges: async (user) => {
    const firstPage = await retryretryApiRequest(List_Completed_Challenges(user, 0));
    let pages = [];
    if (firstPage.success) {
      const countPages = firstPage.data.totalPages;
      const urls = Array.from({ length: countPages }, (_, i) => List_Completed_Challenges(user, i));
      pages = await Promise.all(urls.map(url => retryApiRequest(url))); 
    } else {
      console.warn(`Failed to fetch first page: ${firstPage.error}`);
    }
    return pages;
  },
  getAuthoredChallenges: (user) => retryApiRequest(List_Authored_Challenges(user)),
  getChallenge: (idOrSlug) => retryApiRequest(Code_Challenges_API(idOrSlug)),
};
