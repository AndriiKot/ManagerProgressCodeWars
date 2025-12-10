import { checkFriendsLimit } from './checkFriendsLimit.js';
import { MAX_USERS } from '#config';

const runTest = (description, fn) => {
  try {
    fn();
    console.log(`✅ ${description}`);
  } catch (err) {
    console.log(`❌ ${description}`);
    console.log(`   Error: ${err.message}`);
  }
};

runTest('does not throw when number of friends is within limit', () => {
  const friends = new Array(MAX_USERS).fill('friend');
  checkFriendsLimit(friends);
});

runTest('throws when number of friends exceeds limit', () => {
  const friends = new Array(MAX_USERS + 1).fill('friend');
  try {
    checkFriendsLimit(friends);
    throw new Error('Expected an error but none was thrown');
  } catch (err) {
    if (err.message !== `You can only have up to ${MAX_USERS} friends.`) {
      throw err; 
    }
  }
});

runTest('does not throw when friends array is empty', () => {
  checkFriendsLimit([]);
});
