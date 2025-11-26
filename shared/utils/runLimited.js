"use strict";

import { pLimit } from "./pLimit.js";

export const runLimited = async (limitCount, items, fn) => {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array");
  }

  const limit = pLimit(limitCount);

  const tasks = items.map((item) => limit(() => fn(item)));

  return Promise.all(tasks);
};

