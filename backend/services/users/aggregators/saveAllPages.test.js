'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';

import { saveAllPages } from './saveAllPages.js';

test('saveAllPages aggregates savedCount and errors from all pages', async () => {
  const calls = [];

  const saveCompletedChallengesSafeSync = async (
    db,
    userId,
    user,
    services,
    page,
    existingIds,
  ) => {
    calls.push({ page, hasExistingIds: !!existingIds });

    if (page === 0) {
      return {
        success: true,
        data: { totalPages: 3 },
        savedCount: 2,
        errors: null,
      };
    }

    if (page === 1) {
      return {
        success: true,
        data: {},
        savedCount: 1,
        errors: [{ id: 'x1', error: 'fail' }],
      };
    }

    return {
      success: false,
      errors: new Error('network error'),
    };
  };

  const selectAllChallengeIds = () => new Set(['a1', 'b2']);

  const result = await saveAllPages(
    null,
    1,
    { username: 'TestUser' },
    {
      saveCompletedChallengesSafeSync,
      selectAllChallengeIds,
    }
  );

  assert.equal(result.totalSaved, 3);
  assert.equal(result.allErrors.length, 2);

  assert.deepEqual(
    calls.map(c => c.page),
    [0, 1, 2],
  );

  assert.equal(calls[0].hasExistingIds, true);
  assert.equal(calls[1].hasExistingIds, true);
  assert.equal(calls[2].hasExistingIds, true);
});
