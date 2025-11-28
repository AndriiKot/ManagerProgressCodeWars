'use strict';

import { join } from 'node:path';
import { mkdir, writeFile, stat,  rm } from 'node:fs/promises';
import { CACHE_DIR_CODEWARS, DATA_DIR_CODEWARS } from '#config';
import profileData from './userTest.json' with { type: 'json' };


export const prepareStorageStructure = async ({ user, data }) => {
  const userCacheDir  = join(CACHE_DIR_CODEWARS, user);
  const userDataDir = join(DATA_DIR_CODEWARS, user);

  await Promise.all([
    mkdir(userCacheDir, { recursive: true }),
    mkdir(userDataDir, { recursive: true }),
  ]);


  const filesToCreate = [
    { path: join(userCacheDir, 'userProfile.hash.json'), content: '{}' },
    { path: join(userDataDir, 'userProfile.json'), content: JSON.stringify(data, null, 2) },
  ];


  await Promise.all(
    filesToCreate.map(async ({ path, content }) => {
      try {
        await stat(path);
        console.log(`File exists, skipping: ${path}`);
      } catch {
        await writeFile(path, content, 'utf8');
        console.log(`File created: ${path}`);
      }
    }))

/*
  await Promise.all([
    rm(userCacheDir, { recursive: true, force: true }),
    rm(userDataDir, { recursive: true, force: true }),
  ]); 
*/     
}; 

prepareStorageStructure({ user: 'TestUser', data: profileData});
console.log(profileData);
console.log(typeof profileData);

