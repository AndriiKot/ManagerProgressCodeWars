import test from 'node:test';
import assert from 'node:assert';
import { createLanguageSchema } from './languageSchema.js';

test('createLanguageSchema returns correct schema object', () => {
  const schema = createLanguageSchema();

  assert.strictEqual(typeof schema, 'object');
  assert.deepStrictEqual(schema.required, ['rank', 'name', 'color', 'score']);
  assert.strictEqual(schema.properties.rank.type, 'integer');
  assert.strictEqual(schema.properties.name.type, 'string');
  assert.strictEqual(schema.properties.color.type, 'string');
  assert.strictEqual(schema.properties.score.type, 'integer');
  assert.strictEqual(schema.properties.rank.minimum, -8);
  assert.strictEqual(schema.properties.rank.maximum, 8);
  const expectedEnum = [
    '8 kyu', '7 kyu', '6 kyu', '5 kyu', '4 kyu', '3 kyu', '2 kyu', '1 kyu',
    '1 dan', '2 dan', '3 dan',  '4 dan', '5 dan', '6 dan', '7 dan', '8 dan',
  ];
  assert.deepStrictEqual(schema.properties.name.enum, expectedEnum);
  assert.strictEqual(schema.properties.score.minimum, 0);
  assert.strictEqual(schema.properties.score.positive, true);
});
