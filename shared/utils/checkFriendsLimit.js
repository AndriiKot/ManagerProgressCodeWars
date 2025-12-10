import { MAX_USERS } from '#config';

export const checkFriendsLimit = (friendsArray) => {
  if (!Array.isArray(friendsArray)) {
    throw new TypeError('Expected an array');
  }

  if (friendsArray.length > MAX_USERS) {
    throw new Error(`You can only have up to ${MAX_USERS} users.`);
  }
};
