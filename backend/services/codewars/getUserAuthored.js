'use strict';

import { validateApiResource } from '#contracts';
import { validateSchema, userAuthoredSchema } from '#schemas';
import { CodewarsAPI } from '#api';

const { getAuthoredChallenges } = CodewarsAPI;

export const getUserAuthored = async (username) => {
  return validateApiResource({
    apiFn: getAuthoredChallenges,
    apiArgs: [username],
    schema: userAuthoredSchema,
  });
};
