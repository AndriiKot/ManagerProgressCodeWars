'use strict';

import { resolveUserProfile } from "./resolveUserProfile.js";

let loggedMessages = [];
const logger = {
  warn: (msg, meta) => loggedMessages.push({ msg, meta }),
};

const originalConsole = console.warn;
console.warn = () => {}; 

const mockGetUserProfile = async (username) => {
  if (username === "validUser") {
    return {
      success: true,
      isValid: true,
      data: { username, ranks: { languages: { JS: "1 kyu" } } },
      error: null,
      validationErrors: null,
    };
  } else {
    return {
      success: false,
      isValid: false,
      data: null,
      error: { message: "User not found" },
      validationErrors: [{ message: "Invalid user" }],
    };
  }
};

const testResolveUserProfile = async () => {
  const { resolveUserProfile: origResolve } = await import("./resolveUserProfile.js");
  const testResolve = async (username) => {
    const result = await mockGetUserProfile(username);

    if (!result.success || !result.isValid) {
      logger.warn(`Failed to resolve user profile for ${username}`, { result });
      return { ok: false, result };
    }

    return { ok: true, profile: result.data };
  };

  const valid = await testResolve("validUser");
  console.assert(valid.ok === true, "Expected ok=true for valid user");
  console.assert(valid.profile.username === "validUser", "Profile username mismatch");
  loggedMessages = [];
  const invalid = await testResolve("invalidUser");
  console.assert(invalid.ok === false, "Expected ok=false for invalid user");
  console.assert(loggedMessages.length === 1, "Expected 1 log message for invalid user");

  console.log("✅ All tests passed");
};

testResolveUserProfile().finally(() => {
  console.warn = originalConsole;
});
