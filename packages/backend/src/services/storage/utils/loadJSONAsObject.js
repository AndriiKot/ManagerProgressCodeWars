'use strict';

import { access, readFile } from 'node:fs/promises';

export const loadJSONAsObject = async (filePath) => {
  try {
    await access(filePath);
    const raw = await readFile(filePath, 'utf-8');
    try {
      return JSON.parse(raw);
    } catch (parseErr) {
      console.warn(
        `read file: Failed to parse JSON in ${filePath}: ${parseErr.message}`,
      );
      return {};
    }
  } catch (err) {
    console.warn(`read file: Failed to access ${filePath}: ${err.message}`);
    return {};
  }
};
