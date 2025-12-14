'use strict';

import { retryFetchApiRequest } from './utils/index.js';
import { API_CODEWARS_URL } from './urls.js';

const {
  Users_API,
  List_Completed_Challenges,
  List_Authored_Challenges,
  Code_Challenges_API,
} = API_CODEWARS_URL;

export const CodewarsAPI = {
  getUserProfile: (user) => retryFetchApiRequest(Users_API(user)),
  getCompletedChallenges: (user, pageNumber = 0) =>
    retryFetchApiRequest(List_Completed_Challenges(user, pageNumber)),
  getAuthoredChallenges: (user) =>
    retryFetchApiRequest(List_Authored_Challenges(user)),
  getChallenge: (idOrSlug) =>
    retryFetchApiRequest(Code_Challenges_API(idOrSlug)),
};
