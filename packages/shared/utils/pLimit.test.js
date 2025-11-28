'use strict';

import test from "node:test";
import assert from "node:assert/strict";
import { pLimit } from "./pLimit.js";

const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

test("pLimit — runs tasks with maximum concurrency", async () => {
  const limit = pLimit(2);

  let running = 0;
  let maxParallel = 0;

  const task = async (id) => {
    running++;
    maxParallel = Math.max(maxParallel, running);

    await delay(50);
    running--;

    return id;
  };

  const tasks = [
    limit(() => task(1)),
    limit(() => task(2)),
    limit(() => task(3)),
    limit(() => task(4)),
  ];

  const results = await Promise.all(tasks);

  assert.deepEqual(results, [1, 2, 3, 4]);
  assert.equal(maxParallel, 2, "Should not exceed concurrency limit");
});

test("pLimit — tasks resolve in correct order of returned promises", async () => {
  const limit = pLimit(1);

  const order = [];

  const tasks = [
    limit(async () => {
      await delay(20);
      order.push("A");
      return "A";
    }),
    limit(async () => {
      await delay(10);
      order.push("B");
      return "B";
    }),
  ];

  const result = await Promise.all(tasks);

  assert.deepEqual(result, ["A", "B"]);
  assert.deepEqual(order, ["A", "B"]);
});

test("pLimit — returns values correctly", async () => {
  const limit = pLimit(3);

  const tasks = [
    limit(() => delay(10, 10)),
    limit(() => delay(5, 20)),
    limit(() => delay(0, 30)),
  ];

  const result = await Promise.all(tasks);

  assert.deepEqual(result, [10, 20, 30]);
});

test("pLimit — propagates errors", async () => {
  const limit = pLimit(2);

  const error = new Error("Test error");

  await assert.rejects(
    limit(async () => {
      throw error;
    }),
    {
      message: "Test error",
    }
  );
});

test("pLimit — queues tasks until slots free", async () => {
  const limit = pLimit(1);

  const callOrder = [];

  const tasks = [
    limit(async () => {
      callOrder.push("task1-start");
      await delay(20);
      callOrder.push("task1-end");
    }),
    limit(async () => {
      callOrder.push("task2-start");
      await delay(5);
      callOrder.push("task2-end");
    }),
  ];

  await Promise.all(tasks);

  assert.deepEqual(callOrder, [
    "task1-start",
    "task1-end",
    "task2-start",
    "task2-end",
  ]);
});
