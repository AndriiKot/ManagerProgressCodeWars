'use strict';

import { delay } from './delay.js';

const runTest = async (description, fn) => {
  try {
    await fn();
    console.log(`✅ ${description}`);
  } catch (err) {
    console.log(`❌ ${description}`);
    console.log(`   Error: ${err.message}`);
  }
};

await runTest('delay resolves after specified time', async () => {
  const start = Date.now();
  await delay(100);
  const elapsed = Date.now() - start;
  if (elapsed < 90) throw new Error(`Delay too short: ${elapsed}ms`);
  if (elapsed > 150) throw new Error(`Delay too long: ${elapsed}ms`);
});
