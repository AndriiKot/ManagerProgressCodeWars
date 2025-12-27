'use strict';

import { validateApiResource } from '#contracts';
import { validateSchema, userCodeChallengesSchema } from '#schemas';
import { CodewarsAPI } from '#api';

const { getCompletedChallenges } = CodewarsAPI;

export const getUserCodeChallenges = async (username, page) => {
  return validateApiResource({
    apiFn: getCompletedChallenges,
    apiArgs: [username, page],
    schema: userCodeChallengesSchema,
    validateFn: validateSchema,
  });
};
