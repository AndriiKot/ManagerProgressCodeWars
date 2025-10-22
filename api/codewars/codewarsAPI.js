'use strict';

import { apiRequest } from "../utils/apiRequest.js";
import { API_CODEWARS_URL } from "./urls.js";

const { Users_API, List_Completed_Challenges, List_Authored_Challenges, Code_Challenges_API } = API_CODEWARS_URL;

export const CodewarsAPI = {
  getUserProfile: (user) => apiRequest(Users_API(user)),
  getCompletedChallenges: (user, pageNumber = 0) => apiRequest(List_Completed_Challenges(user, pageNumber)),
  getAllPagesCompletedChallenges: async (user) => {
    const firstPage = await CodewarsAPI.getCompletedChallenges(user);
    let pages = [];
    if (firstPage.success) {
      const countPages = firstPage.data.totalPages;
      const urls = Array.from({ length: countPages }, (_, i) => List_Completed_Challenges(user, i));
      pages = await Promise.all(urls.map(url => apiRequest(url))); 
    } else {
      console.warn(`Failed to fetch first page: ${firstPage.error}`);
    }
    return pages;
  },
  getAuthoredChallenges: (user) => apiRequest(List_Authored_Challenges(user)),
  getChallenge: (idOrSlug) => apiRequest(Code_Challenges_API(idOrSlug)),
};
