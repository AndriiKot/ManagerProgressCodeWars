'use strict';

import { askUsername } from "./askUsername.js";

const mockRl = (answers) => {
  let i = 0;
  return {
    question: async () => answers[i++],
    close: () => {},
  };
};

const suppressConsole = () => {
  const originalLog = console.log;
  const originalWarn = console.warn;

  console.log = () => {};
  console.warn = () => {};

  return () => {
    console.log = originalLog;
    console.warn = originalWarn;
  };
};

(async () => {
  const restoreConsole = suppressConsole();

  const rlUsername = mockRl(["", "AndriiKot"]);
  const username = await askUsername(rlUsername);
  console.assert(username === "AndriiKot", `Expected "AndriiKot", got "${username}"`);

  restoreConsole();

  console.log("✅ askUsername test passed");
})();
