"use strict";

import { fetchApiJson } from "./fetchApiJson.js";

/**
 * @typedef {string|number|boolean|null|JsonObject|JsonArray} JsonValue
 * @typedef {Object.<string, JsonValue>} JsonObject
 * @typedef {Array<JsonValue>} JsonArray
 */

/**
 * Tries multiple times to call an API request until it succeeds or maximum retries are reached.
 *
 * @param {string} url - The target URL to fetch from.
 * @param {number} [retries=3] - Maximum number of retry attempts.
 * @param {number} [delayMs=500] - Delay in milliseconds between retries.
 * @param {(url: string) => Promise<{success: boolean, data: JsonValue | null, error: string | null}>} [fn=fetchApiJson ]
 *   Function to execute the request. Must return a Promise resolving to an object with {success, data, error}.
 *
 * @returns {Promise<{success: boolean, data: JsonValue | null, error: string | null}>}
 *   Resolves with the result of the first successful request, or the final failed attempt.
 *
 * @example
 * const result = await retryFetchApiRequest("https://api.example.com/data", 5, 1000);
 * if (result.success) {
 *   console.log("Data:", result.data);
 * } else {
 *   console.error("Error:", result.error);
 * }
 */
export const retryFetchApiRequest = async (
  url,
  retries = 3,
  delayMs = 500,
  fn = fetchApiJson
) => {
  for (let i = 0; i < retries; i++) {
    const result = await fn(url);
    if (result.success) return result;
    console.warn(`Attempt ${i + 1} failed for ${url}: ${result.error}`);
    if (i < retries - 1) await new Promise((r) => setTimeout(r, delayMs));
  }
  return {
    success: false,
    data: null,
    error: `All ${retries} attempts failed for ${url}`,
  };
};
