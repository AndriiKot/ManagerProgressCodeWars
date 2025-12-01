'use strict';

import { validateApiResource } from './validateApiResource.js';
import { validateSchema, userCodeChallengesSchema } from '#shared';
import { CodewarsAPI } from '#api';

const { getCompletedChallenges } = CodewarsAPI;
console.log(getCompletedChallenges.toString());

export const fetchUserCodeChallenges = async (username, page) => {
  return validateApiResource({
    apiFn: getCompletedChallenges,
    apiArgs: [username, page],
    schema: userCodeChallengesSchema,
    validateFn: validateSchema,
  });
};

