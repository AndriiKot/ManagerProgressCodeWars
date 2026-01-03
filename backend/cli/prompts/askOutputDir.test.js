'use strict';

import { askOutputDir } from "./askOutputDir.js";

const mockRl = (answers) => {
  let i = 0;
  return {
    question: async (prompt) => {
      console.log(prompt); 
      return answers[i++];
    },
    close: () => {}
  };
};

(async () => {
  const rl1 = mockRl([""]);
  const result1 = await askOutputDir(rl1);
  console.assert(result1 === "codewars", `Expected "codewars", got "${result1}"`);

  const rl2 = mockRl(["my_output"]);
  const result2 = await askOutputDir(rl2);
  console.assert(result2 === "my_output", `Expected "my_output", got "${result2}"`);

  const rl3 = mockRl(["inv@lid!", "goodDir"]);
  const result3 = await askOutputDir(rl3);
  console.assert(result3 === "goodDir", `Expected "goodDir", got "${result3}"`);

  const rl4 = mockRl(["."]);
  const result4 = await askOutputDir(rl4);
  console.assert(result4 === ".", `Expected ".", got "${result4}"`);

  const rl5 = mockRl(["./subfolder"]);
  const result5 = await askOutputDir(rl5);
  console.assert(result5 === "subfolder", `Expected "subfolder", got "${result5}"`);

  const rl6 = mockRl(["dir1/dir2"]);
  const result6 = await askOutputDir(rl6);
  console.assert(result6 === "dir1/dir2", `Expected "dir1/dir2", got "${result6}"`);

  const rl7 = mockRl(["inv*dir", "validDir"]);
  const result7 = await askOutputDir(rl7);
  console.assert(result7 === "validDir", `Expected "validDir", got "${result7}"`);

  console.log("✅ All tests passed");
})();
