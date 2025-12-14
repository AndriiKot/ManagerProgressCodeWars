'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchAllUserCodeChallenges } from './fetchAllUserCodeChallenges.js';

test('fetchAllUserCodeChallenges basic structure', async () => {
  const result = await fetchAllUserCodeChallenges('SomeUsername');

  assert.ok(Array.isArray(result), 'Result should be an array');

  if (result.length > 0) {
    const firstPage = result[0];
    assert.equal(typeof firstPage.success, 'boolean', 'success should be boolean');
    assert.ok(firstPage.data && typeof firstPage.data.totalPages === 'number', 'data.totalPages should exist');
  }
});
