'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { BOT_BASE, BOT_FOLDERS, FILES } from './botStructure.js';

test('BOT_BASE should be a non-empty string', () => {
  assert.equal(typeof BOT_BASE, 'string', 'BOT_BASE must be a string');
  assert.ok(BOT_BASE.length > 0, 'BOT_BASE must not be empty');
});

test('BOT_FOLDERS should be a non-empty array of strings', () => {
  assert.ok(Array.isArray(BOT_FOLDERS), 'BOT_FOLDERS must be an array');
  assert.ok(BOT_FOLDERS.length > 0, 'BOT_FOLDERS must not be empty');

  for (const folder of BOT_FOLDERS) {
    assert.equal(typeof folder, 'string', 'Each folder must be a string');
    assert.ok(folder.length > 0, 'Folder names must not be empty');
  }
});

test('FILES should be an object with string values', () => {
  assert.equal(typeof FILES, 'object', 'FILES must be an object');
  assert.ok(FILES !== null, 'FILES must not be null');

  for (const [key, value] of Object.entries(FILES)) {
    assert.ok(BOT_FOLDERS.includes(key), `FILES key "${key}" must match a folder`);
    assert.equal(typeof value, 'string', `FILES value for "${key}" must be a string`);
    assert.ok(value.length > 0, `FILES value for "${key}" must not be empty`);
  }
});
