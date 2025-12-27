'use strict';

import { validateApiResource } from '#contracts';
import { validateWithRankCheck, userProfileSchema } from '#schemas';
import { CodewarsAPI } from '#api';

const { getUserProfile: getUserProfileApi } = CodewarsAPI;

export const getUserProfile = async (username) => {
  return validateApiResource({
    apiFn: getUserProfileApi,
    apiArgs: [username],
    schema: userProfileSchema,
    validateFn: validateWithRankCheck,
  });
};
