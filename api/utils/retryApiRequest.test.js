import test from 'node:test';
import assert from 'node:assert/strict';
import { retryApiRequest } from './retryApiRequest.js';

test('returns data immediately if first attempt succeeds', async () => {
  const fn = async () => ({ success: true, data: 'ok', error: null });
  const result = await retryApiRequest('url', 3, 0, fn);
  assert.deepEqual(result, { success: true, data: 'ok', error: null });
});

test('retries on failure and succeeds later', async () => {
  let attempts = 0;
  const fn = async () => {
    attempts++;
    if (attempts < 3) return { success: false, data: null, error: 'fail' };
    return { success: true, data: 'ok', error: null };
  };
  const result = await retryApiRequest('url', 5, 0, fn);
  assert.equal(result.success, true);
  assert.equal(attempts, 3);
});

test('returns failure after all retries', async () => {
  let attempts = 0;
  const fn = async () => {
    attempts++;
    return { success: false, data: null, error: 'fail' };
  };
  const result = await retryApiRequest('url', 2, 0, fn);
  assert.equal(result.success, false);
  assert.equal(attempts, 2); 
});
