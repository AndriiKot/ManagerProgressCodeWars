'use strict';

import { createRootReadme } from './createRootReadme.js';
import { createUserGitHubAction } from './createUserGitHubAction.js';

export const initUser = (root, profile) => {
  createRootReadme(root, profile);
  createUserGitHubAction(root);  
} 
