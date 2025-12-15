'use strict';

import { MAX_USERS } from '#config';

export const checkUsersLimit = (usersArray) => {
  if (!Array.isArray(usersArray)) {
    throw new TypeError('Expected an array');
  }

  if (usersArray.length > MAX_USERS) {
    throw new Error(`You can only have up to ${MAX_USERS} users.`);
  }
};
