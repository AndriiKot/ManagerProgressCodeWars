"use strict";

import { deepFreeze } from "#shared-utils";

/**
 * @typedef {string|number|boolean|null|JsonObject|JsonArray} JsonValue
 * @typedef {Object.<string, JsonValue>} JsonObject
 * @typedef {Array<JsonValue>} JsonArray
 */


/**
 * Makes a GET request and returns unified result.
 *
 * @param {string} url - Target URL to fetch from.
 * @returns {Promise<{success: boolean, data: JsonValue | null, error: string | null}>}
 *          `data` will contain the parsed JSON from the response if successful, otherwise null.
 */
export const fetchApiJson = async (url) => {
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return deepFreeze({ success: true, data, error: null });
    } else {
      return deepFreeze({
        success: false,
        data: null,
        error: `HTTP ${res.status}: ${res.statusText}`,
      });
    }
  } catch (err) {
    console.error(`Cannot fetch from ${url}: ${err.message}`);
    return deepFreeze({ success: false, data: null, error: err.message });
  }
};
