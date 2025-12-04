'use strict';

import { validateApiResource } from './validateApiResource.js';
import { validateWithRankCheck, codeChallengeSchema } from '#schemas';
import { CodewarsAPI } from '#api';

const { getChallenge } = CodewarsAPI;

export const fetchCodeChallenge = async (idOrSlug) => {
  return validateApiResource({
    apiFn: getChallenge,
    apiArgs: [idOrSlug],
    schema: codeChallengeSchema,
    validateFn: validateWithRankCheck,         
  });
};

