'use strict';

import { join, parse } from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { CACHE_DIR_CODEWARS } from '#config';

export async function loadUsersCache(cacheDir = CACHE_DIR_CODEWARS) {
  const usersData = Object.create(null);

  const folderUsers = (await readdir(cacheDir, { withFileTypes: true }))
    .filter(e => e.isDirectory())
    .map(e => e.name);

  await Promise.all(
    folderUsers.map(async (userName) => {
      const userDir = join(cacheDir, userName);

      const files = (await readdir(userDir, { withFileTypes: true }))
        .filter(e => e.isFile())
        .map(e => e.name);

      const userObject = Object.create(null);

      await Promise.all(
        files.map(async (filename) => {
          const filePath = join(userDir, filename);
          const { name } = parse(filename);

          const raw = await readFile(filePath, 'utf-8');
          userObject[name] = JSON.parse(raw);
        })
      );

      usersData[userName] = userObject;
    })
  );

  return usersData;
}

