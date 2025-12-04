'use strict';

import test from 'node:test';
import assert from 'node:assert';
import { USER_NAME } from '#config';
import {
  fetchUserProfile,
  fetchUserCodeChallenges,
  fetchUserAuthored,
  fetchCodeChallenge,
} from '#api';

test('Full Codewars API flow returns valid data', async (t) => {

  await t.test('1. User Profile should be valid', async () => {
    const profile = await fetchUserProfile(USER_NAME);
    assert.strictEqual(profile.success, true, 'fetchUserProfile failed');
    assert.strictEqual(profile.isValid, true, 'User profile data is invalid');
  });

  await t.test('2. Completed Challenges should be valid', async () => {
    const completed = await fetchUserCodeChallenges(USER_NAME, 0);
    assert.strictEqual(completed.success, true, 'fetchUserCodeChallenges failed');
    assert.strictEqual(completed.isValid, true, 'Completed challenges data is invalid');
  });

  await t.test('3. Authored Challenges should be valid', async () => {
    const authored = await fetchUserAuthored(USER_NAME);
    assert.strictEqual(authored.success, true, 'fetchUserAuthored failed');
    assert.strictEqual(authored.isValid, true, 'Authored challenges data is invalid');
  });

  await t.test('4. Single Challenge by ID should be valid', async () => {
    const challenge = await fetchCodeChallenge('56aed32a154d33a1f3000018');
    assert.strictEqual(challenge.success, true, 'fetchCodeChallenge failed');
    assert.strictEqual(challenge.isValid, true, 'Challenge data is invalid');
  });

});
