'use strict';

import { apiRequest } from "../utils/apiRequest.js";
import { API_CODEWARS_URL } from "./urls.js";

const { Users_API, List_Completed_Challenges, List_Authored_Challenges, Code_Challenges_API } = API_CODEWARS_URL;

export const CodewarsAPI = {
  getUserProfile: (user) => apiRequest(Users_API(user)),
  getCompletedChallenges: (user, page = 0) => apiRequest(List_Completed_Challenges(user, page)),
  getAuthoredChallenges: (user) => apiRequest(List_Authored_Challenges(user)),
  getChallenge: (idOrSlug) => apiRequest(Code_Challenges_API(idOrSlug)),
};