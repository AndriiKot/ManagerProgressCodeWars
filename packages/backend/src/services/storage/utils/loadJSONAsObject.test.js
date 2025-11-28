'use strict';

import { loadJSONAsObject } from './loadJSONAsObject.js';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const testFilePath = join('.', 'test.json');

const runTest = async () => {
  await writeFile(testFilePath, JSON.stringify({ a: 1, b: 2 }), 'utf-8');
  let data = await loadJSONAsObject(testFilePath);
  if (data.a !== 1 || data.b !== 2) throw new Error('Test failed');

  await writeFile(testFilePath, '{ a: 1, b: 2 ', 'utf-8');
  data = await loadJSONAsObject(testFilePath);
  if (Object.keys(data).length !== 0) throw new Error('Test failed');

  data = await loadJSONAsObject(join('.', 'nonexistent.json'));
  if (Object.keys(data).length !== 0) throw new Error('Test failed');

  console.log('All tests passed ✅');
};
