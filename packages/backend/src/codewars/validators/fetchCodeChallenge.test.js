'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { validateApiResource } from '#codewars';

test('returns valid result when API succeeds and validation passes', async () => {
  const apiFn = async () => ({
    success: true,
    data: { name: 'Example Challenge', difficulty: '8kyu' },
    error: null,
  });

  const validateFn = () => ({
    isValid: true,
    errors: null,
  });

  const result = await validateApiResource({
    apiFn,
    apiArgs: ['example-slug'],
    schema: {},
    validateFn,
  });

  assert.equal(result.isValid, true);
  assert.equal(result.validationErrors, null);
  assert.deepEqual(result.data, { name: 'Example Challenge', difficulty: '8kyu' });
});

test('returns error when API fails', async () => {
  const apiFn = async () => ({
    success: false,
    data: null,
    error: 'Network error',
  });

  const result = await validateApiResource({
    apiFn,
    apiArgs: ['example-slug'],
    schema: {},
  });

  assert.equal(result.isValid, false);
  assert.deepEqual(result.validationErrors, ['API request failed']);
});

test('returns validation errors when validation fails', async () => {
  const apiFn = async () => ({
    success: true,
    data: { name: 'Example Challenge', difficulty: '8kyu' },
    error: null,
  });

  const validateFn = () => ({
    isValid: false,
    errors: ['invalid challenge data'],
  });

  const result = await validateApiResource({
    apiFn,
    apiArgs: ['example-slug'],
    schema: {},
    validateFn,
  });

  assert.equal(result.isValid, false);
  assert.deepEqual(result.validationErrors, ['invalid challenge data']);
});
