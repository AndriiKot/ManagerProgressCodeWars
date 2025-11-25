'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { validateApiResource } from '#codewars';

test('returns valid result when API succeeds and validation passes', async () => {
  const apiFn = async () => ({
    success: true,
    data: { items: ['challenge1', 'challenge2'] },
    error: null,
  });

  const validateFn = () => ({
    isValid: true,
    errors: null,
  });

  const result = await validateApiResource({
    apiFn,
    apiArgs: ['TestUser'],
    schema: {},
    validateFn,
  });

  assert.equal(result.isValid, true);
  assert.equal(result.validationErrors, null);
  assert.deepEqual(result.data, { items: ['challenge1', 'challenge2'] });
});

test('returns error when API fails', async () => {
  const apiFn = async () => ({
    success: false,
    data: null,
    error: 'Network error',
  });

  const result = await validateApiResource({
    apiFn,
    apiArgs: ['TestUser'],
    schema: {},
  });

  assert.equal(result.isValid, false);
  assert.deepEqual(result.validationErrors, ['API request failed']);
});

test('returns validation errors when validation fails', async () => {
  const apiFn = async () => ({
    success: true,
    data: { items: [] },
    error: null,
  });

  const validateFn = () => ({
    isValid: false,
    errors: ['invalid authored data'],
  });

  const result = await validateApiResource({
    apiFn,
    apiArgs: ['TestUser'],
    schema: {},
    validateFn,
  });

  assert.equal(result.isValid, false);
  assert.deepEqual(result.validationErrors, ['invalid authored data']);
});
