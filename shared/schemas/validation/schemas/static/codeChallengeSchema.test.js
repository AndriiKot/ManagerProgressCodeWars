'use strict';

import test from 'node:test';
import assert from 'node:assert';
import { codeChallengeSchema, validateSchema } from '#schemas';

test('codeChallengeSchema validates correct data', () => {
  const data = {
    id: '56aed32a154d33a1f3000018',
    name: 'Fix the Bugs (Syntax) - My First Kata',
    slug: 'fix-the-bugs-syntax-my-first-kata',
    url: 'https://www.codewars.com/kata/56aed32a154d33a1f3000018',
    category: 'bug_fixes',
    description: 'desc',
    tags: ['Debugging'],
    languages: ['javascript','ruby','python','php','coffeescript'],
    rank: { id: -8, name: '8 kyu', color: 'white' },
    createdBy: { username: 'donaldsebleung', url: 'https://www.codewars.com/users/donaldsebleung' },
    approvedBy: { username: 'joh_pot', url: 'https://www.codewars.com/users/joh_pot' },
    totalAttempts: 39120,
    totalCompleted: 10961,
    totalStars: 78,
    voteScore: 1466,
    publishedAt: '2016-02-01T04:46:11.692Z',
    approvedAt: '2016-02-20T00:19:14.254Z',
    createdAt: '2016-02-01T03:38:18.651Z',
    contributorsWanted: true,
    unresolved: { issues: 1, suggestions: 5 },
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
  const data = { id: '56aed32a154d33a1f3000018', name: 'Fix the Bugs' };

  const result = validateSchema({
    schema: codeChallengeSchema,
    data,
    options: { strict: true },
  });

  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some(e => e.message.includes("Required field 'slug' is missing")));
  assert.ok(result.errors.some(e => e.message.includes("Required field 'contributorsWanted' is missing")));
  assert.ok(result.errors.some(e => e.message.includes("Required field 'unresolved' is missing")));
});

test('codeChallengeSchema fails with extra fields when additionalProperties=false', () => {
  const data = {
    ...{
      id: '56aed32a154d33a1f3000018',
      name: 'Fix the Bugs',
      slug: 'fix-the-bugs',
      url: 'url',
      category: 'bug_fixes',
      description: 'desc',
      tags: ['Debugging'],
      languages: ['javascript'],
      rank: { id: -8, name: '8 kyu', color: 'white' },
      createdBy: { username: 'user', url: 'url' },
      approvedBy: { username: 'user', url: 'url' },
      totalAttempts: 1,
      totalCompleted: 0,
      totalStars: 0,
      voteScore: 0,
      publishedAt: '2025-11-25T12:00:00Z',
      approvedAt: '2025-11-25T12:00:00Z',
      createdAt: '2025-11-25T11:00:00Z',
      contributorsWanted: false,
      unresolved: { issues: 0, suggestions: 0 },
    },
    extraField: 'not allowed',
  };

  const result = validateSchema({
    schema: codeChallengeSchema,
    data,
    options: { strict: true },
  });

  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some(e => e.message.includes("Unexpected field 'extraField'")));
});
