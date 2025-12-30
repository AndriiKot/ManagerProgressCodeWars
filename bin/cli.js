#!/usr/bin/env node

import { scaffoldProject as init } from "#commands";

const [, , command] = process.argv;

switch (command) {
  case "init":
    await init();
    break;

  default:
    console.log("Usage:");
    console.log("  codewars_bot init");
}
