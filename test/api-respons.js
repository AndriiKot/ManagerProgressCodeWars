import { USER_NAME } from '#config';
import { CodewarsAPI } from '#api';
import {
  userProfileSchema,
  userCodeChallengesSchema,
  userAuthoredSchema,
  codeChallengeSchema,
  validateWithRankCheck,
} from '#schemas';

import { Storage } from '#storage';

(async () => {
  const {
    getUserProfile,
    getCompletedChallenges,
    getChallenge,
    getAuthoredChallenges,
  } = CodewarsAPI;

  //
  // 1. User Profile
  //
  {
    const { success, data } = await getUserProfile(USER_NAME);

    if (success) {
      const validationResult = validateWithRankCheck({
        schema: userProfileSchema,
        data,
        options: { recursive: true, strict: true },
      });

      console.log(`user profile ${USER_NAME} data is valid!`);
    }
  }

  //
  // 2. Completed Challenges
  //
  {
    const { success, data } = await getCompletedChallenges(USER_NAME);

    if (success) {
      const validationResult = validateWithRankCheck({
        schema: userCodeChallengesSchema,
        data,
        options: { recursive: true, strict: true },
      });

      console.log(`getCompletedChallenges ${USER_NAME} data is valid!`);
    }
  }

  //
  // 3. Authored Challenges
  //
  {
    const { success, data } = await getAuthoredChallenges(USER_NAME);

    if (success) {
      const validationResult = validateWithRankCheck({
        schema: userAuthoredSchema,
        data,
        options: { recursive: true, strict: true },
      });

      console.log(`getAuthoredChallenges ${USER_NAME} data is valid!`);
    }
  }

  //
  // 4. Single Challenge by ID
  //
  {
    const { success, data } = await getChallenge('56aed32a154d33a1f3000018');

    if (success) {
      const validationResult = validateWithRankCheck({
        schema: codeChallengeSchema,
        data,
        options: { recursive: true, strict: true },
      });

      console.log(`Challenge 56aed32a154d33a1f3000018 data is valid!`);
    }
  }
})();
