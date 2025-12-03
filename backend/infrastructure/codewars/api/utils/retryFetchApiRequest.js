"use strict";

import { fetchApiJson } from "./fetchApiJson.js";
import { deepFreeze } from "#shared-utils";

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
  return deepFreeze({
    success: false,
    data: null,
    error: `All ${retries} attempts failed for ${url}`,
  });
};
