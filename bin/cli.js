#!/usr/bin/env node

import { init, sync } from "#commands";

const [, , command] = process.argv;

switch (command) {
  case "init":
    await init();
    break;
  
  case "sync":
    await sync();
    break;

  default:
    console.log("Usage:");
    console.log("  codewars_bot init");
}
