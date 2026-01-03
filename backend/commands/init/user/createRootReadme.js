'use strict';

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { logger } from '#utils';

export const createRootReadme = async(root, profile) => {
  const filePath = join(root, 'README.md');

  try {
    const content = 
      `#Hello\n\n` +
      `User: ${profile.username}\n`;
    await writeFile(filePath, content); 
  } catch (err) {
    logger.warn(`Can't create main README.md: ${err.message}`);
  } 
}