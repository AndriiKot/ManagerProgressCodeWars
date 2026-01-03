'use strict';

import { logger } from "#utils";
import path from "node:path";

export const askOutputDir = async (rl) => {
  while (true) {
    let dir = (await rl.question("Output directory (default: codewars, '.' = current folder): ")).trim();

    if (!dir) return "codewars";

    if (dir === ".") return ".";

    if (/[*?"<>|]/.test(dir)) {
      logger.warn("Directory name contains invalid characters. Avoid: * ? \" < > |");
      continue;
    }

    dir = path.normalize(dir);

    return dir;
  }
};
