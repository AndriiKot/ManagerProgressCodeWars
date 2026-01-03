'use strict';

import { getUserProfile } from '#services';

export const resolveUserProfile = async (username) => {
  const result = await getUserProfile(username);

  if (!result.success || !result.isValid) {
    return { ok: false, result };
  }

  return { ok: true, profile: result.data };
};

