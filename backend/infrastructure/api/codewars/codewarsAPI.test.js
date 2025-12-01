'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { CodewarsAPI } from './codewarsAPI.js';

global.fetch = async (url) => {
  return {
    ok: true,
    json: async () => ({ mocked: url }),
  };
};

test('CodewarsAPI', async (t) => {
  await t.test('getUserProfile returns mocked data', async () => {
    const user = 'alice';
    const url = `https://www.codewars.com/api/v1/users/${user}`;
    const res = await CodewarsAPI.getUserProfile(user);

    assert.deepStrictEqual(res, {
      success: true,
      url,
      data: { mocked: url },
      error: null,
    });
  });

  await t.test('getCompletedChallenges returns mocked data', async () => {
    const user = 'bob';
    const page = 2;
    const url = `https://www.codewars.com/api/v1/users/${user}/code-challenges/completed?page=${page}`;

    const res = await CodewarsAPI.getCompletedChallenges(user, page);

    assert.deepStrictEqual(res, {
      success: true,
      url,
      data: { mocked: url },
      error: null,
    });
  });

  await t.test('getAuthoredChallenges returns mocked data', async () => {
    const user = 'charlie';
    const url = `https://www.codewars.com/api/v1/users/${user}/code-challenges/authored`;

    const res = await CodewarsAPI.getAuthoredChallenges(user);

    assert.deepStrictEqual(res, {
      success: true,
      url,
      data: { mocked: url },
      error: null,
    });
  });

  await t.test('getChallenge returns mocked data', async () => {
    const idOrSlug = '12345';
    const url = `https://www.codewars.com/api/v1/code-challenges/${idOrSlug}`;

    const res = await CodewarsAPI.getChallenge(idOrSlug);

    assert.deepStrictEqual(res, {
      success: true,
      url,
      data: { mocked: url },
      error: null,
    });
  });
});
