'use strict';

import { buildInitConfig } from "./buildInitConfig.js";

(async () => {
  const mockProfile = {
    username: "AndriiKot",
    ranks: {
      languages: {
        JavaScript: { rank: 5, name: "5 kyu" },
        SQL: { rank: 4, name: "4 kyu" }
      }
    }
  };

  const outputDir = "codewars";

  const config = buildInitConfig(mockProfile, outputDir);

  console.assert(config.username === "AndriiKot", `Expected username "AndriiKot", got "${config.username}"`);
  console.assert(Array.isArray(config.languages), "Expected languages to be an array");
  console.assert(config.languages.includes("JavaScript") && config.languages.includes("SQL"), 
    `Expected languages to include JavaScript and SQL, got ${config.languages}`);
  console.assert(config.autoCommit === true, `Expected autoCommit true, got ${config.autoCommit}`);
  console.assert(config.outputDir === outputDir, `Expected outputDir "${outputDir}", got "${config.outputDir}"`);
  console.assert(config.lastSync === null, `Expected lastSync null, got ${config.lastSync}`);

  console.log("✅ buildInitConfig test passed");
})();
