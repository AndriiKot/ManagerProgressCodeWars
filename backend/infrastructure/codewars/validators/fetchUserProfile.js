'use strict';

import { validateApiResource } from './validateApiResource.js';
import { validateWithRankCheck, userProfileSchema } from '#schemas';
import { CodewarsAPI } from '#api';

const { getUserProfile } = CodewarsAPI;

export const fetchUserProfile = async (username) => {
  return validateApiResource({
    apiFn: getUserProfile,
    apiArgs: [username],
    schema: userProfileSchema,
    validateFn: validateWithRankCheck,   
  });
};
