'use strict';

import { initBot } from './bot/index.js';
import { initUser } from './user/index.js';
import { getUserProfile } from '#services';


export const init = async() => {
  const root = process.cwd();
  const testUser = await getUserProfile('AndriiKot');
  console.log(testUser);

  initBot(root);
  initUser(root, testUser.data);

  console.log("✅ Codewars bot initialized");
}



