'use strict';

import { pLimit } from './pLimit.js';
import { delay } from './delay.js';

export const createSafeApiCall = ({ concurrency = 2, interval = 400 } = {}) => {
  const limit = pLimit(concurrency);

  let lastCallTime = 0;

  const waitInterval = async () => {
    const now = Date.now();
    const diff = now - lastCallTime;
    if (diff < interval) {
      await delay(interval - diff);
    }
    lastCallTime = Date.now();
  };

  return (fn) => {
    return (...args) => limit(async () => {
      await waitInterval();
      return fn(...args);
    });
  };
};

