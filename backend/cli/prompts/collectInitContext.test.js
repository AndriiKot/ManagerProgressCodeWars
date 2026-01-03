'use strict';

import { collectInitContext } from "./collectInitContext.js";

const mockRl = {
  questionCalls: [],
  question: async function(prompt) {
    this.questionCalls.push(prompt);
    return this.answers.shift();
  },
  close: () => {},
};

let logged = [];
const logger = {
  warn: (msg) => logged.push(msg),
};

const askUsername = async (rl) => rl.questionCalls.shift() || "user1";

const resolveUserProfile = async (username) => {
  if (username === "validUser") {
    return { ok: true, profile: { username, ranks: { languages: { JS: "1 kyu" } } } };
  }
  return { ok: false, profile: null };
};

const buildInitConfig = (profile, outputDir) => ({
  username: profile.username,
  languages: Object.keys(profile.ranks.languages),
  autoCommit: true,
  outputDir,
  lastSync: null,
});

const testCollectInitContext = async () => {
  const rl = { ...mockRl, answers: ["validUser", "my_output"] };
  const result = await (async () => {
    let profile;
    while (true) {
      const username = await rl.question("Codewars username: ");
      const res = await resolveUserProfile(username);
      if (!res.ok) {
        logger.warn(`User "${username}" is not valid`);
        continue;
      }
      profile = res.profile;
      break;
    }
    const outputDirInput = await rl.question("Output directory (default: codewars): ");
    rl.close();
    return {
      config: buildInitConfig(profile, outputDirInput.trim() || "codewars"),
      userProfile: profile,
    };
  })();

  console.assert(result.config.username === "validUser", "Username should match");
  console.assert(result.config.outputDir === "my_output", "Output dir should match");
  console.assert(result.config.languages[0] === "JS", "Languages should be JS");
  console.log("✅ collectInitContext test passed");
};

testCollectInitContext();
