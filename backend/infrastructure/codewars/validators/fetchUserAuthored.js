'use strict';

import { validateApiResource } from './validateApiResource.js';
import { validateSchema, userAuthoredSchema } from '#shared';
import { CodewarsAPI } from '#api';

const { getAuthoredChallenges } = CodewarsAPI;

export const fetchUserAuthored = async (username) => {
  return validateApiResource({
    apiFn: getAuthoredChallenges,
    apiArgs: [username],
    schema: userAuthoredSchema,
  });
};

