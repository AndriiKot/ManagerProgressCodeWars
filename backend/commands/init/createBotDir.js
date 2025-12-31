'use strict';

import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export const createBotDir = (root) => {
  const botDir = join(root, '.codewars-bot');

  if(!existsSync(botDir)) {
    mkdirSync(botDir, { recursive: true });
  }
  
}
