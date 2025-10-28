import test from "node:test";
import assert from "node:assert";
import { createCodewarsRankValidator } from "./codewarsRankValidator.js";

test("valid rank-name pair passes validation", () => {
  const validate = createCodewarsRankValidator();
  const errors = [];

  validate({ rank: -8, name: "8 kyu" }, "ranks.sql", errors);
  assert.strictEqual(errors.length, 0);
});

test("invalid rank-name pair adds error", () => {
  const validate = createCodewarsRankValidator();
  const errors = [];

  validate({ rank: -8, name: "7 kyu" }, "ranks.sql", errors);
  assert.strictEqual(errors.length, 1);
  assert.match(errors[0].message, /should have name '8 kyu'/);
  assert.strictEqual(errors[0].path, "ranks.sql.name");
});

test("rank without name produces no error", () => {
  const validate = createCodewarsRankValidator();
  const errors = [];

  validate({ rank: -3 }, "ranks.python", errors);
  assert.strictEqual(errors.length, 0);
});

test("name without rank produces no error", () => {
  const validate = createCodewarsRankValidator();
  const errors = [];

  validate({ name: "2 dan" }, "ranks.overall", errors);
  assert.strictEqual(errors.length, 0);
});

test("unknown rank is ignored (not in map)", () => {
  const validate = createCodewarsRankValidator();
  const errors = [];

  validate({ rank: 99, name: "Master" }, "ranks.custom", errors);
  assert.strictEqual(errors.length, 0);
});
