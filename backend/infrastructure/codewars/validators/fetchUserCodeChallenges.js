'use strict';

import { validateApiResource } from './validateApiResource.js';
import { validateSchema, userCodeChallengesSchema } from '#schemas';
import { CodewarsAPI } from '#api';

const { getCompletedChallenges } = CodewarsAPI;

export const fetchUserCodeChallenges = async (username, page) => {
  return validateApiResource({
    apiFn: getCompletedChallenges,
    apiArgs: [username, page],
    schema: userCodeChallengesSchema,
    validateFn: validateSchema,
  });
};

