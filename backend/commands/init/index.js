'use strict';

import { createBotDir } from './createBotDir.js';

export const init = async() => {
  const root = process.cwd();

  createBotDir(root);

  console.log("✅ Codewars bot initialized");
}


