'use strict';

import { createUserServiceDeps } from './createUserServiceDeps.js';

const runTest = async (description, fn) => {
  try {
    await fn();
    console.log(`✅ ${description}`);
  } catch (err) {
    console.log(`❌ ${description}`);
    console.log(`   Error: ${err.message}`);
  }
};

const mockApiFn = async (arg) => arg * 2;

const mockSqlite = {
  insertChallengeSync: (c) => c,
  selectAllChallengeIds: () => ({ ids: [] }),
  insertAuthoredChallengeSync: (u, c) => true,
  insertCompletedChallengeSync: (u, c) => true,
};

await runTest('createUserServiceDeps wraps API functions with safeApiCall', async () => {
  const deps = createUserServiceDeps(mockSqlite);

  if (typeof deps.getUserAuthored !== 'function') throw new Error('getUserAuthored is not a function');
  if (typeof deps.getUserCodeChallenges !== 'function') throw new Error('getUserCodeChallenges is not a function');
  if (typeof deps.getCodeChallenge !== 'function') throw new Error('getCodeChallenge is not a function');

  const res = await deps.getUserAuthored(5);
  if (res !== 10) throw new Error(`Unexpected result from getUserAuthored: ${res}`);
});
