'use strict';

import assert from 'node:assert';
import { DatabaseSync } from 'node:sqlite';
import { sqlite } from '#db';

function simpleBootstrapDatabaseTest() {
  const db = new DatabaseSync(':memory:');

  assert.strictEqual(typeof db, 'object', 'db must be an object');
  assert.strictEqual(typeof db.exec, 'function', 'db must have exec method');

  console.log('✅ In-memory database test passed');
}

simpleBootstrapDatabaseTest();
