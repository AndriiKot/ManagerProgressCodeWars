'use strict';

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCodewarsSyncWorkflow } from '#templates';

export const createUserGitHubAction = (root) => {
  const ghWorkflowDir = join(root, '.github', 'workflows');

  if (!existsSync(ghWorkflowDir)) {
    mkdirSync(ghWorkflowDir, { recursive: true });
  }

  const workflowContent = getCodewarsSyncWorkflow();
  const targetPath = join(ghWorkflowDir, 'codewars-sync.yml');

  writeFileSync(targetPath, workflowContent, 'utf-8');

  console.log(`GitHub Actions workflow created at ${targetPath}`);
};

