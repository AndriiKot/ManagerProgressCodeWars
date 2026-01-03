'use strict';

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { logger } from '#utils';
import { askOutputDir } from './askOutputDir.js';
import { askUsername } from './askUsername.js';
import { buildInitConfig } from './buildInitConfig.js';
import { resolveUserProfile } from './resolveUserProfile.js';

export const collectInitContext = async () => {
  const rl = readline.createInterface({ input, output });

  let profile;

  while (true) {
    const username = await askUsername(rl);
    const result = await resolveUserProfile(username);

    if (!result.ok) {
      logger.warn(`User "${username}" is not valid`);
      continue;
    }

    profile = result.profile;
    break;
  }

  const outputDirInput = await rl.question(
    "Output directory (default: codewars): "
  );

  rl.close();

  return {
    config: buildInitConfig(profile, outputDirInput.trim() || "codewars"),
    userProfile: profile,
  };
};

