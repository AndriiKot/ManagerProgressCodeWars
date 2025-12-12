'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { loadUsersCache } from './loadUsersCache.js';

test('loadUsersCache correctly loads users and their JSON files', async () => {
  // create a temporary directory
  const tempDir = await mkdtemp(join(tmpdir(), 'cache-test-'));

  // ---------------------------
  // Create test structure:
  //
  // tempDir/
  //   UserA/
  //     profile.json
  //   UserB/
  //     stats.json
  // ---------------------------

  const userA = join(tempDir, 'UserA');
  const userB = join(tempDir, 'UserB');

  await mkdir(userA);
  await mkdir(userB);

  await writeFile(
    join(userA, 'profile.json'),
    JSON.stringify({ name: 'UserA', honor: 150 })
  );

  await writeFile(
    join(userB, 'stats.json'),
    JSON.stringify({ solved: 42 })
  );

  // execute function
  const data = await loadUsersCache(tempDir); // <-- pass temporary directory

  // ---------------------------
  // Assertions
  // ---------------------------

  assert.ok(data);
  assert.equal(typeof data, 'object');

  assert.deepEqual(Object.keys(data).sort(), ['UserA', 'UserB']);

  assert.deepEqual(data.UserA.profile, { name: 'UserA', honor: 150 });
  assert.deepEqual(data.UserB.stats, { solved: 42 });
});
