import test from 'node:test';
import assert from 'node:assert';
import { userAuthoredSchema, validateSchema } from '#schemas';

test('userAuthoredSchema validates correct data', () => {
  const data = {
    data: [
      {
        id: '651bfcbd409ea1001ef2c3cb',
        name: 'Roguelike game 1 - stats and weapon',
        description: 'Some description',
        rank: 5,
        rankName: '5 kyu',
        tags: ['Puzzles', 'Games'],
        languages: ['javascript', 'python']
      }
    ]
  };

  const result = validateSchema({
    schema: userAuthoredSchema,
    data,
    options: { strict: true } 
  });

  assert.strictEqual(result.isValid, true);
  assert.deepStrictEqual(result.errors, []);
});

test('userAuthoredSchema fails with missing required fields', () => {
  const data = {
    data: [
      {
        id: '123',
        name: 'Test'
      }
    ]
  };

  const result = validateSchema({
    schema: userAuthoredSchema,
    data,
    options: { strict: true }
  });

  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some(e => e.message.includes("Required field 'rank' is missing")));
  assert.ok(result.errors.some(e => e.message.includes("Required field 'tags' is missing")));
});

test('userAuthoredSchema fails with extra fields when additionalProperties=false', () => {
  const data = {
    data: [
      {
        id: '123',
        name: 'Test',
        description: 'desc',
        rank: 1,
        rankName: '1 kyu',
        tags: ['JS'],
        languages: ['javascript'],
        extraField: 'not allowed' 
      }
    ]
  };

  const result = validateSchema({
    schema: userAuthoredSchema,
    data,
    options: { strict: true }
  });

  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some(e => e.message.includes("Unexpected field 'extraField'")));
});

test('userAuthoredSchema fails with invalid types', () => {
  const data = {
    data: [
      {
        id: '123',
        name: 'Test',
        description: 'desc',
        rank: { wrong: 'type' }, 
        rankName: '1 kyu',
        tags: ['JS'],
        languages: ['javascript']
      }
    ]
  };

  const result = validateSchema({
    schema: userAuthoredSchema,
    data,
    options: { strict: true }
  });

  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some(e => e.path === 'data[0].rank'));
});
