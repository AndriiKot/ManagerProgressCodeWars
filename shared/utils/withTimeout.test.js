'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { withTimeout } from './withTimeout.js';

const delay = (ms, value) =>
  new Promise(resolve => setTimeout(() => resolve(value), ms));

test('withTimeout — resolves if promise finishes before timeout', async () => {
  const result = await withTimeout(() => delay(10, 42), 50);
  assert.equal(result, 42);
});

test('withTimeout — rejects if promise exceeds timeout', async () => {
  await assert.rejects(
    withTimeout(() => delay(100, 42), 50),
    { message: 'Timeout' }
  );
});

test('withTimeout — retries once if promise fails initially', async () => {
  let attempts = 0;
  const fn = () => {
    attempts++;
    if (attempts === 1) return Promise.reject(new Error('Fail'));
    return Promise.resolve('ok');
  };

  const result = await withTimeout(fn, 50, 1);
  assert.equal(result, 'ok');
  assert.equal(attempts, 2, 'Should retry exactly once');
});

test('withTimeout — fails after all retries exhausted', async () => {
  let attempts = 0;
  const fn = () => {
    attempts++;
    return Promise.reject(new Error('AlwaysFail'));
  };

  await assert.rejects(
    withTimeout(fn, 50, 2),
    { message: 'AlwaysFail' }
  );
  assert.equal(attempts, 3, 'Should attempt initial + 2 retries');
});
