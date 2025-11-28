"use strict";

import test from "node:test";
import assert from "node:assert/strict";
import { fetchApiJson } from "./fetchApiJson.js";

global.fetch = async (url) => {
  if (url === "https://example.com/success") {
    return {
      ok: true,
      json: async () => ({ message: "ok" }),
    };
  }
  if (url === "https://example.com/error") {
    return {
      ok: false,
      status: 404,
      statusText: "Not Found",
    };
  }
  throw new Error("Network failure");
};

test("fetchApiJson  returns data on successful fetch", async () => {
  const result = await fetchApiJson("https://example.com/success");
  assert.strictEqual(result.success, true);
  assert.deepStrictEqual(result.data, { message: "ok" });
  assert.strictEqual(result.error, null);
});

test("fetchApiJson  returns error object on HTTP error", async () => {
  const result = await fetchApiJson("https://example.com/error");
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.data, null);
  assert.strictEqual(result.error, "HTTP 404: Not Found");
});

test("fetchApiJson  returns error object on network failure", async () => {
  const result = await fetchApiJson("https://example.com/fail");
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.data, null);
  assert.match(result.error, /Network failure/);
});
