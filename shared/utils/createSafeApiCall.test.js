'use strict';

import { createSafeApiCall } from './createSafeApiCall.js';
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

const testCreateSafeApiCall = async () => {
  let callOrder = [];
  const apiFn = async (x) => {
    callOrder.push({ x, time: Date.now() });
    await delay(50);
    return x * 2;
  };

  const safeApiCall = createSafeApiCall({ concurrency: 2, interval: 100 });
  const wrapped = safeApiCall(apiFn);
  const startTime = Date.now();
  const promises = [1,2,3,4,5].map(n => wrapped(n));
  const results = await Promise.all(promises);
  const totalTime = Date.now() - startTime;

  return { results, callOrder, totalTime };
};

await runTest('returns correct results and respects concurrency/interval', async () => {
  const { results, totalTime } = await testCreateSafeApiCall();

  if (results.join(',') !== '2,4,6,8,10') throw new Error(`Unexpected results: ${results}`);
  if (totalTime < 200) throw new Error(`Interval/concurrency not respected: totalTime=${totalTime}`);
});
