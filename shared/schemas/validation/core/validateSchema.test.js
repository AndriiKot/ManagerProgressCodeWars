import assert from 'node:assert';
import test from 'node:test';
import { validateSchema } from './validateSchema.js';

const baseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    honor: { type: 'integer', positive: true },
    rank: { type: 'integer' },
    score: { type: 'number', minimum: 0 },
  },
  required: ['id', 'honor'],
};

test('valid data passes validation', () => {
  const data = { id: 'abc', honor: 10, rank: 3, score: 50.5 };
  const result = validateSchema(baseSchema, data);
  assert.strictEqual(result.isValid, true);
  assert.deepStrictEqual(result.errors, []);
});

test('missing required field', () => {
  const data = { honor: 10 };
  const result = validateSchema(baseSchema, data);
  assert.strictEqual(result.isValid, false);
  assert.match(result.errors[0].message, /Required field 'id' is missing/);
});

test('invalid data type', () => {
  const data = { id: 123, honor: 10 };
  const result = validateSchema(baseSchema, data);
  assert.strictEqual(result.isValid, false);
  assert.match(result.errors[0].message, /Expected type 'string'/);
});

test('positive check — negative number', () => {
  const data = { id: 'abc', honor: -5 };
  const result = validateSchema(baseSchema, data);
  assert.strictEqual(result.isValid, false);
  assert.match(result.errors[0].message, /Expected positive number/);
});

test('minimum check — value below minimum', () => {
  const data = { id: 'abc', honor: 5, score: -10 };
  const result = validateSchema(baseSchema, data);
  assert.strictEqual(result.isValid, false);
  assert.match(result.errors[0].message, /less than minimum/);
});

test('strict mode — unexpected fields', () => {
  const schema = { ...baseSchema, strict: true };
  const data = { id: 'abc', honor: 10, extra: 'oops' };
  const result = validateSchema(schema, data, { strict: true });
  assert.strictEqual(result.isValid, false);
  assert.match(result.errors[0].message, /Unexpected field/);
});

test('recursive validation of nested objects', () => {
  const schema = {
    type: 'object',
    properties: {
      user: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          stats: {
            type: 'object',
            properties: { rank: { type: 'integer', negative: true } },
          },
        },
      },
    },
  };

  const data = {
    user: {
      name: 'Krillan',
      stats: { rank: 1 },
    },
  };

  const result = validateSchema(schema, data);
  assert.strictEqual(result.isValid, false);
  assert.match(result.errors[0].message, /Expected negative number/);
});

test('array of objects validation', () => {
  const schema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        score: { type: 'integer', minimum: 0 },
      },
    },
  };

  const data = [{ score: 10 }, { score: -5 }];
  const result = validateSchema(schema, data);
  assert.strictEqual(result.isValid, false);
  assert.match(result.errors[0].message, /less than minimum/);
});
