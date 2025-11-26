'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { runLimited } from './runLimited.js';

const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

test('runLimited — throws if items is not an array', async () => {
  await assert.rejects(
    runLimited(2, null, () => {}),
    {
      name: 'TypeError',
      message: 'items must be an array',
    }
  );

  await assert.rejects(
    runLimited(2, {}, () => {}),
    {
      name: 'TypeError',
      message: 'items must be an array',
    }
  );
});

test('runLimited — runs all tasks and returns results in order', async () => {
  const items = [1, 2, 3, 4, 5];

  const fn = async (n) => {
    await delay(10);
    return n * 2;
  };

  const result = await runLimited(2, items, fn);

  assert.deepEqual(result, [2, 4, 6, 8, 10]);
});

test('runLimited — respects concurrency limit', async () => {
  let running = 0;
  let maxRunning = 0;

  const items = [1, 2, 3, 4, 5, 6];

  const fn = async () => {
    running++;
    maxRunning = Math.max(maxRunning, running);
    await delay(20);
    running--;
  };

  await runLimited(2, items, fn);

  assert.equal(maxRunning, 2, 'Should not exceed concurrency limit 2');
});

test('runLimited — propagates errors from fn', async () => {
  const items = [1, 2, 3];

  const fn = async (n) => {
    if (n === 2) {
      throw new Error('Boom!');
    }
    return n;
  };

  await assert.rejects(
    runLimited(2, items, fn),
    { message: 'Boom!' }
  );
});

test('runLimited — tasks run in mapped order even if execute at different speeds', async () => {
  const items = ['A', 'B'];

  const fn = async (value) => {
    if (value === 'A') {
      await delay(20);
    } else {
      await delay(5);
    }
    return value;
  };

  const result = await runLimited(1, items, fn);

  assert.deepEqual(result, ['A', 'B']);
});

test('runLimited — queueing works: second starts only after first ends when limit=1', async () => {
  const calls = [];

  const items = [1, 2];

  const fn = async (n) => {
    calls.push(`task${n}-start`);
    await delay(n === 1 ? 20 : 5);
    calls.push(`task${n}-end`);
  };

  await runLimited(1, items, fn);

  assert.deepEqual(calls, [
    'task1-start',
    'task1-end',
    'task2-start',
    'task2-end',
  ]);
});
