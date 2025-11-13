import test from 'node:test';
import assert from 'node:assert';
import { codeChallengeSchema, validateSchema } from '#schemas';

test('codeChallengeSchema validates correct data', () => {
  const data = {
    id: '5277c8a221e209d3f6000b56',
    name: 'Valid Braces',
    slug: 'valid-braces',
    url: 'http://www.codewars.com/kata/valid-braces',
    category: 'algorithms',
    description: 'Write a function called `validBraces`...',
    tags: ['Algorithms', 'Validation', 'Logic', 'Utilities'],
    languages: ['javascript', 'coffeescript'],
    rank: { id: -4, name: '4 kyu', color: 'blue' },
    createdBy: {
      username: 'xDranik',
      url: 'http://www.codewars.com/users/xDranik',
    },
    approvedBy: {
      username: 'xDranik',
      url: 'http://www.codewars.com/users/xDranik',
    },
    totalAttempts: 4911,
    totalCompleted: 919,
    totalStars: 12,
    voteScore: 512,
    publishedAt: '2013-11-05T00:07:31Z',
    approvedAt: '2013-12-20T14:53:06Z',
  };

  const result = validateSchema({
    schema: codeChallengeSchema,
    data,
    options: { strict: true },
  });

  assert.strictEqual(result.isValid, true);
  assert.deepStrictEqual(result.errors, []);
});

test('codeChallengeSchema fails with missing required fields', () => {
  const data = {
    id: '5277c8a221e209d3f6000b56',
    name: 'Valid Braces',
  };

  const result = validateSchema({
    schema: codeChallengeSchema,
    data,
    options: { strict: true },
  });

  assert.strictEqual(result.isValid, false);
  assert.ok(
    result.errors.some((e) =>
      e.message.includes("Required field 'slug' is missing"),
    ),
  );
  assert.ok(
    result.errors.some((e) =>
      e.message.includes("Required field 'url' is missing"),
    ),
  );
  assert.ok(
    result.errors.some((e) =>
      e.message.includes("Required field 'rank' is missing"),
    ),
  );
});

test('codeChallengeSchema fails with extra fields when additionalProperties=false', () => {
  const data = {
    id: '5277c8a221e209d3f6000b56',
    name: 'Valid Braces',
    slug: 'valid-braces',
    url: 'http://www.codewars.com/kata/valid-braces',
    category: 'algorithms',
    description: 'desc',
    tags: ['Algorithms'],
    languages: ['javascript'],
    rank: { id: -4, name: '4 kyu', color: 'blue' },
    createdBy: {
      username: 'xDranik',
      url: 'http://www.codewars.com/users/xDranik',
    },
    approvedBy: {
      username: 'xDranik',
      url: 'http://www.codewars.com/users/xDranik',
    },
    totalAttempts: 1,
    totalCompleted: 0,
    totalStars: 0,
    voteScore: 0,
    publishedAt: '2013-11-05T00:07:31Z',
    approvedAt: '2013-12-20T14:53:06Z',
    extraField: 'not allowed',
  };

  const result = validateSchema({
    schema: codeChallengeSchema,
    data,
    options: { strict: true },
  });

  assert.strictEqual(result.isValid, false);
  assert.ok(
    result.errors.some((e) =>
      e.message.includes("Unexpected field 'extraField'"),
    ),
  );
});

test('codeChallengeSchema fails with invalid types', () => {
  const data = {
    id: 123,
    name: 'Valid Braces',
    slug: 'valid-braces',
    url: 'http://www.codewars.com/kata/valid-braces',
    category: 'algorithms',
    description: 'desc',
    tags: 'Algorithms',
    languages: ['javascript'],
    rank: { id: '-4', name: 4, color: true },
    createdBy: {
      username: 'xDranik',
      url: 'http://www.codewars.com/users/xDranik',
    },
    approvedBy: {
      username: 'xDranik',
      url: 'http://www.codewars.com/users/xDranik',
    },
    totalAttempts: '4911',
    totalCompleted: 919,
    totalStars: 12,
    voteScore: 512,
    publishedAt: '2013-11-05T00:07:31Z',
    approvedAt: '2013-12-20T14:53:06Z',
  };

  const result = validateSchema({
    schema: codeChallengeSchema,
    data,
    options: { strict: true },
  });

  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some((e) => e.path === 'id'));
  assert.ok(result.errors.some((e) => e.path === 'tags'));
  assert.ok(result.errors.some((e) => e.path === 'rank.id'));
  assert.ok(result.errors.some((e) => e.path === 'rank.name'));
  assert.ok(result.errors.some((e) => e.path === 'rank.color'));
  assert.ok(result.errors.some((e) => e.path === 'totalAttempts'));
});
