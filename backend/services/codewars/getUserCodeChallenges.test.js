'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { validateApiResource } from '#contracts';

test('returns valid result when API succeeds and validation passes', async () => {
  const apiFn = async () => ({
    success: true,
    data: { name: 'Andrii' },
    error: null,
  });

  const validateFn = () => ({
    isValid: true,
    errors: null,
  });

  const result = await validateApiResource({
    apiFn,
    apiArgs: [],
    schema: {},
    validateFn,
  });

  assert.equal(result.isValid, true);
  assert.equal(result.validationErrors, null);
  assert.deepEqual(result.data, { name: 'Andrii' });
});

test('returns error when API fails', async () => {
  const apiFn = async () => ({
    success: false,
    data: null,
    error: 'Network error',
  });

  const result = await validateApiResource({
    apiFn,
    apiArgs: [],
    schema: {},
  });

  assert.equal(result.isValid, false);
  assert.deepEqual(result.validationErrors, ['API request failed']);
});

test('returns validation errors when validation fails', async () => {
  const apiFn = async () => ({
    success: true,
    data: { name: 'Andrii' },
    error: null,
  });

  const validateFn = () => ({
    isValid: false,
    errors: ['rank invalid'],
  });

  const result = await validateApiResource({
    apiFn,
    apiArgs: [],
    schema: {},
    validateFn,
  });

  assert.equal(result.isValid, false);
  assert.deepEqual(result.validationErrors, ['rank invalid']);
});
