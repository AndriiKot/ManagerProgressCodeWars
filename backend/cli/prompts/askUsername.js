'use strict';

import { logger } from "#utils";

export const askUsername = async (rl) => {
  while (true) {
    const username = (await rl.question("Codewars username: ")).trim();

    if (!username) {
      logger.warn("Username cannot be empty");
      continue;
    }

    return username;
  }
};

