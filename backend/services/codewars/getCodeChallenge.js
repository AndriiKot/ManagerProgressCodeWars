'use strict';

import { validateApiResource } from '#contracts';
import { validateWithRankCheck, codeChallengeSchema } from '#schemas';
import { CodewarsAPI } from '#api';

const { getChallenge } = CodewarsAPI;

export const getCodeChallenge = async (idOrSlug) => {
  return validateApiResource({
    apiFn: getChallenge,
    apiArgs: [idOrSlug],
    schema: codeChallengeSchema,
    validateFn: validateWithRankCheck,
  });
};
