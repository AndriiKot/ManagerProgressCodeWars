'use strict';

import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { BOT_FOLDERS, BOT_BASE } from './botStructure.js'


export const createBotDir = (root) => {
  const base = join(root, BOT_BASE);


  if (!existsSync(base)) {
    mkdirSync(base, { recursive: true });
  }

  for (const dir of BOT_FOLDERS) {
    mkdirSync(join(base, dir), { recursive: true });
  }
};
