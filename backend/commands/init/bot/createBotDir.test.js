'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { createBotDir } from './createBotDir.js';
import { BOT_BASE, BOT_FOLDERS } from './botStructure.js';

test('createBotDir creates .codewars-bot structure', () => {
  const root = join(tmpdir(), 'codewars-bot-test');

  rmSync(root, { recursive: true, force: true });

  createBotDir(root);

  const base = join(root, BOT_BASE);

  assert.ok(existsSync(base), `${BOT_BASE} should exist`);

  for (const dir of BOT_FOLDERS) {
    assert.ok(
      existsSync(join(base, dir)),
      `Directory ${dir} should exist`
    );
  }

  rmSync(root, { recursive: true, force: true });
});
