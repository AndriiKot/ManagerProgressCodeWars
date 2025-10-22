'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { apiRequest } from './apiRequest.js';

global.fetch = async (url) => {
  if (url === 'https://example.com/success') {
    return {
      ok: true,
      json: async () => ({ message: 'ok' }),
    };
  }
  if (url === 'https://example.com/error') {
    return {
      ok: false,
      status: 404,
      statusText: 'Not Found',
    };
  }
  throw new Error('Network failure');
};

test('apiRequest returns data on successful fetch', async () => {
  const result = await apiRequest('https://example.com/success');
  assert.strictEqual(result.success, true);
  assert.deepStrictEqual(result.data, { message: 'ok' });
  assert.strictEqual(result.error, null);
});

test('apiRequest returns error object on HTTP error', async () => {
  const result = await apiRequest('https://example.com/error');
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.data, null);
  assert.strictEqual(result.error, 'HTTP 404: Not Found');
});

test('apiRequest returns error object on network failure', async () => {
  const result = await apiRequest('https://example.com/fail');
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.data, null);
  assert.match(result.error, /Network failure/);
});
