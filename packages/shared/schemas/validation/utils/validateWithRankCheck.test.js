import test from 'node:test';
import assert from 'node:assert';
import { validateWithRankCheck } from './validateWithRankCheck.js';

const invalidResponse = {
  id: '625dae5f8f66eb001c7ef330',
  username: 'Krillan',
  honor: 29699,
  ranks: {
    overall: {
      rank: 2,
      name: '3 dan',
      color: 'black',
      score: 38060,
    },
    languages: {
      sql: {
        rank: -8,
        name: '7 kyu',
        color: 'blue',
        score: 3015,
      },
      shell: {
        rank: -6,
        name: '5 kyu',
        color: 'yellow',
        score: 416,
      },
      python: {
        rank: 2,
        name: '3 dan',
        color: 'green',
        score: 4500,
      },
    },
  },
};

const validResponse = {
  id: '625dae5f8f66eb001c7ef330',
  username: 'Krillan',
  honor: 29699,
  ranks: {
    overall: {
      rank: 2,
      name: '2 dan',
      color: 'black',
      score: 38060,
    },
    languages: {
      ruby: {
        rank: -1,
        name: '1 kyu',
        color: 'purple',
        score: 28600,
      },
      sql: {
        rank: -8,
        name: '8 kyu',
        color: 'blue',
        score: 3015,
      },
      javascript: {
        rank: -2,
        name: '2 kyu',
        color: 'purple',
        score: 6801,
      },
      shell: {
        rank: -6,
        name: '6 kyu',
        color: 'yellow',
        score: 416,
      },
      python: {
        rank: 2,
        name: '2 dan',
        color: 'green',
        score: 4500,
      },
    },
  },
};

test('validateWithRankCheck detects incorrect rank-name pairs', () => {
  const result = validateWithRankCheck({}, invalidResponse);
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.length > 0);
  console.log('❌ Validation errors found:');
  for (const err of result.errors) {
    console.log(`  ${err.path}: ${err.message}`);
  }
  assert.ok(
    result.errors.some((e) => e.path.startsWith('ranks.')),
    'Expected at least one rank-related error',
  );
});

test('validateWithRankCheck passes for valid rank-name pairs', () => {
  const result = validateWithRankCheck({}, validResponse);
  console.log(result.errors);
  assert.strictEqual(result.isValid, true, 'Expected data to be valid');
  assert.deepStrictEqual(result.errors, []);
});
