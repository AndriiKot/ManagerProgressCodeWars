import test from 'node:test';
import assert from 'node:assert';
import { userCodeChallengesSchema, validateSchema } from '#schemas';

test('userCodeChallengesSchema validates correct data', () => {
  const data = {
    totalPages: 2,
    totalItems: 5,
    data: [
      {
        id: 'abc123',
        name: 'Sample Challenge',
        slug: 'sample-challenge',
        completedLanguages: ['javascript', 'python'],
        completedAt: '2025-11-13T18:00:00Z',
      },
    ],
  };

  const result = validateSchema({
    schema: userCodeChallengesSchema,
    data,
    options: { strict: true },
  });

  assert.strictEqual(result.isValid, true);
  assert.deepStrictEqual(result.errors, []);
});

test('userCodeChallengesSchema fails with missing required fields', () => {
  const data = {
    totalPages: 1,
    totalItems: 1,
    data: [
      {
        id: 'abc123',
        name: 'Sample Challenge',
      },
    ],
  };

  const result = validateSchema({
    schema: userCodeChallengesSchema,
    data,
    options: { strict: true },
  });

  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some(e => e.message.includes("Required field 'slug' is missing")));
  assert.ok(result.errors.some(e => e.message.includes("Required field 'completedLanguages' is missing")));
  assert.ok(result.errors.some(e => e.message.includes("Required field 'completedAt' is missing")));
});

test('userCodeChallengesSchema fails with extra fields when additionalProperties=false', () => {
  const data = {
    totalPages: 1,
    totalItems: 1,
    data: [
      {
        id: 'abc123',
        name: 'Sample Challenge',
        slug: 'sample-challenge',
        completedLanguages: ['javascript'],
        completedAt: '2025-11-13T18:00:00Z',
        extraField: 'not allowed',
      },
    ],
  };

  const result = validateSchema({
    schema: userCodeChallengesSchema,
    data,
    options: { strict: true },
  });

  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some(e => e.message.includes("Unexpected field 'extraField'")));
});

test('userCodeChallengesSchema fails with invalid types', () => {
  const data = {
    totalPages: 1,
    totalItems: 1,
    data: [
      {
        id: 123, // should be string
        name: 'Sample Challenge',
        slug: 'sample-challenge',
        completedLanguages: 'javascript', // should be array
        completedAt: '2025-11-13T18:00:00Z',
      },
    ],
  };

  const result = validateSchema({
    schema: userCodeChallengesSchema,
    data,
    options: { strict: true },
  });

  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some(e => e.path === 'data[0].id'));
  assert.ok(result.errors.some(e => e.path === 'data[0].completedLanguages'));
});

test('userCodeChallengesSchema fails with invalid date format', () => {
  const data = {
    totalPages: 1,
    totalItems: 1,
    data: [
      {
        id: 'abc123',
        name: 'Sample Challenge',
        slug: 'sample-challenge',
        completedLanguages: ['javascript'],
        completedAt: 'invalid-date',
      },
    ],
  };

  const result = validateSchema({
    schema: userCodeChallengesSchema,
    data,
    options: { strict: true },
  });

  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some(e => e.path === 'data[0].completedAt' && e.message.includes('valid ISO 8601 date-time')));
});
