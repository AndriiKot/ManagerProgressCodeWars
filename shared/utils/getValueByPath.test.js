'use strict';

import test from 'node:test';
import assert from 'node:assert';
import { getValueByPath } from './getValueByPath.js';

test('getValueByPath — returns the correct value for an existing path', () => {
  const obj = { user: { name: { first: 'Andrii', last: 'Kotsiuba' } } };
  const result = getValueByPath(obj, 'user.name.first');
  assert.strictEqual(result, 'Andrii');
});

test('getValueByPath — returns undefined for a non-existing path', () => {
  const obj = { user: { name: 'Andrii' } };
  const result = getValueByPath(obj, 'user.age');
  assert.strictEqual(result, undefined);
});

test('getValueByPath — returns the whole object for an empty path', () => {
  const obj = { user: { name: 'Andrii' } };
  const result = getValueByPath(obj, '');
  assert.deepStrictEqual(result, obj);
});

test('getValueByPath — correctly handles deeply nested objects', () => {
  const obj = { a: { b: { c: { d: 123 } } } };
  const result = getValueByPath(obj, 'a.b.c.d');
  assert.strictEqual(result, 123);
});

test('getValueByPath — correctly works with arrays and numeric indexes', () => {
  const obj = { users: [{ name: 'A' }, { name: 'B' }] };
  const result = getValueByPath(obj, 'users.1.name');
  assert.strictEqual(result, 'B');
});

test('getValueByPath — returns undefined if an intermediate value is undefined', () => {
  const obj = { user: undefined };
  const result = getValueByPath(obj, 'user.name');
  assert.strictEqual(result, undefined);
});

test('getValueByPath — returns undefined if an intermediate value is null', () => {
  const obj = { user: null };
  const result = getValueByPath(obj, 'user.name');
  assert.strictEqual(result, undefined);
});

test('getValueByPath — returns primitive values correctly', () => {
  const obj = { value: 42 };
  const result = getValueByPath(obj, 'value');
  assert.strictEqual(result, 42);
});
