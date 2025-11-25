'use strict';

import { USER_NAME } from '#config';
import {
  fetchUserProfile,
  fetchUserCodeChallenges,
  fetchUserAuthored,
  fetchCodeChallenge,
} from '#codewars';

(async () => {
  //
  // 1. User Profile
  //
  {
    const result = await fetchUserProfile(USER_NAME);
    if (result.success && result.isValid) {
      console.log(`user profile ${USER_NAME} data is valid!`);
    } else {
      console.error(`user profile ${USER_NAME} validation failed:`, result.validationErrors || result.error);
    }
  }

  //
  // 2. Completed Challenges
  //
  {
    const result = await fetchUserCodeChallenges(USER_NAME, 0);
    if (result.success && result.isValid) {
      console.log(`getCompletedChallenges ${USER_NAME} data is valid!`);
    } else {
      console.error(`getCompletedChallenges ${USER_NAME} validation failed:`, result.validationErrors || result.error);
    }
  }

  //
  // 3. Authored Challenges
  //
  {
    const result = await fetchUserAuthored(USER_NAME);
    if (result.success && result.isValid) {
      console.log(`getAuthoredChallenges ${USER_NAME} data is valid!`);
    } else {
      console.error(`getAuthoredChallenges ${USER_NAME} validation failed:`, result.validationErrors || result.error);
    }
  }

  //
  // 4. Single Challenge by ID
  //
  {
    const result = await fetchCodeChallenge('56aed32a154d33a1f3000018');
    if (result.success && result.isValid) {
      console.log(`Challenge 56aed32a154d33a1f3000018 data is valid!`);
    } else {
      console.error(`Challenge 56aed32a154d33a1f3000018 validation failed:`, result.validationErrors || result.error);
    }
  }
})();
