import test from 'node:test';
import assert from 'node:assert';
import { userProfileSchema, validateSchema } from '#schemas';

test('userProfileSchema validates correct data', () => {
  const data = {
    id: '123',
    username: 'Krillan',
    name: 'Andrii',
    honor: 1000,
    clan: '',
    leaderboardPosition: 5,
    skills: ['javascript', 'ruby'],
    ranks: {
      overall: {
        rank: 2,
        name: '2 dan',
        color: 'black',
        score: 5000
      },
      languages: {
        javascript: {
          rank: -2,
          name: '2 kyu',
          color: 'purple',
          score: 6801
        },
        ruby: {
          rank: -1,
          name: '1 kyu',
          color: 'red',
          score: 28600
        }
      }
    },
    codeChallenges: {
      totalAuthored: 2,
      totalCompleted: 4377
    }
  };

  const result = validateSchema(userProfileSchema, data);
  assert.strictEqual(result.isValid, true);
  assert.deepStrictEqual(result.errors, []);
});

test('userProfileSchema fails with missing required fields', () => {
  const data = { username: 'Krillan', honor: 1000 };
  const result = validateSchema(userProfileSchema, data);
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some(e => e.message.includes("Required field 'id' is missing")));
  assert.ok(result.errors.some(e => e.message.includes("Required field 'ranks' is missing")));
});

test('userProfileSchema fails with invalid enum values', () => {
  const data = {
    id: '123',
    username: 'Krillan',
    honor: 1000,
    leaderboardPosition: 5,
    ranks: {
      overall: {
        rank: 2,
        name: '10 kyu', // ❌ недопустимое значение
        color: 'black',
        score: 5000
      },
      languages: {
        javascript: {
          rank: -2,
          name: '2 kyu',
          color: 'purple',
          score: 6801
        }
      }
    },
    codeChallenges: {
      totalAuthored: 2,
      totalCompleted: 4377
    }
  };

  const result = validateSchema(userProfileSchema, data);
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some(e => e.path === 'ranks.overall.name'));
});