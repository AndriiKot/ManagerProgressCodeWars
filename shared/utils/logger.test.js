'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { logger } from './logger.js';

test('logger.info calls console.log', () => {
  const calls = [];

  const original = console.log;
  console.log = (msg) => calls.push(msg);

  logger.info('info message');

  console.log = original;

  assert.equal(calls.length, 1);
  assert.ok(calls[0].includes('[INFO]'));
  assert.ok(calls[0].includes('info message'));
});

test('logger.warn calls console.warn', () => {
  const calls = [];

  const original = console.warn;
  console.warn = (msg) => calls.push(msg);

  logger.warn('warn message');

  console.warn = original;

  assert.equal(calls.length, 1);
  assert.ok(calls[0].includes('[WARN]'));
  assert.ok(calls[0].includes('warn message'));
});

test('logger.error calls console.error', () => {
  const calls = [];

  const original = console.error;
  console.error = (msg) => calls.push(msg);

  logger.error('error message');

  console.error = original;

  assert.equal(calls.length, 1);
  assert.ok(calls[0].includes('[ERROR]'));
  assert.ok(calls[0].includes('error message'));
});

test('logger serializes meta object', () => {
  const calls = [];

  const original = console.log;
  console.log = (msg) => calls.push(msg);

  logger.info('meta message', { user: 'Andrii', id: 1 });

  console.log = original;

  assert.ok(calls[0].includes('"user":"Andrii"'));
  assert.ok(calls[0].includes('"id":1'));
});
