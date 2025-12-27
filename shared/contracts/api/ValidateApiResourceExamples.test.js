'use strict';

import assert from 'node:assert';
import { ValidateApiResourceExamples } from './ValidateApiResourceExamples.js';

const getUserProfile = ValidateApiResourceExamples.getUserProfile;

assert.strictEqual(getUserProfile.success, true, 'getUserProfile.success should be true');
assert.strictEqual(getUserProfile.url, 'https://www.codewars.com/api/v1/users/{username}', 'getUserProfile.url is incorrect');
assert.deepStrictEqual(getUserProfile.data, {
  id: 'string',
  username: 'string',
  name: 'string',
  honor: 0,
  clan: 'string',
  leaderboardPosition: 0,
  skills: [],
  ranks: { overall: { rank: 0, name: 'string' }, languages: {} },
  codeChallenges: { totalAuthored: 0, totalCompleted: 0 }
}, 'getUserProfile.data is incorrect');
assert.strictEqual(getUserProfile.error, null, 'getUserProfile.error should be null');
assert.strictEqual(getUserProfile.isValid, true, 'getUserProfile.isValid should be true');
assert.strictEqual(getUserProfile.validationErrors, null, 'getUserProfile.validationErrors should be null');

try {
  getUserProfile.success = false;
} catch (err) {
  console.log('Cannot modify getUserProfile.success:', err.message);
}

const getCodeChallenge = ValidateApiResourceExamples.getCodeChallenge;

assert.strictEqual(getCodeChallenge.success, true, 'getCodeChallenge.success should be true');
assert.strictEqual(getCodeChallenge.url, 'https://www.codewars.com/api/v1/code-challenges/{idOrSlug}', 'getCodeChallenge.url is incorrect');
assert.deepStrictEqual(getCodeChallenge.data, {
  id: 'string',
  name: 'string',
  description: 'string',
  ranks: {},
  languages: [],
  tags: []
}, 'getCodeChallenge.data is incorrect');
assert.strictEqual(getCodeChallenge.error, null, 'getCodeChallenge.error should be null');
assert.strictEqual(getCodeChallenge.isValid, true, 'getCodeChallenge.isValid should be true');
assert.strictEqual(getCodeChallenge.validationErrors, null, 'getCodeChallenge.validationErrors should be null');

try {
  getCodeChallenge.data.id = 'newId';
} catch (err) {
  console.log('Cannot modify getCodeChallenge.data.id:', err.message);
}

const getUserAuthored = ValidateApiResourceExamples.getUserAuthored;

assert.strictEqual(getUserAuthored.success, true, 'getUserAuthored.success should be true');
assert.strictEqual(getUserAuthored.url, 'https://www.codewars.com/api/v1/users/{username}/code-challenges/authored', 'getUserAuthored.url is incorrect');
assert.deepStrictEqual(getUserAuthored.data, {
  totalAuthored: 0,
  challenges: []
}, 'getUserAuthored.data is incorrect');
assert.strictEqual(getUserAuthored.error, null, 'getUserAuthored.error should be null');
assert.strictEqual(getUserAuthored.isValid, true, 'getUserAuthored.isValid should be true');
assert.strictEqual(getUserAuthored.validationErrors, null, 'getUserAuthored.validationErrors should be null');

console.log('All tests passed!');
