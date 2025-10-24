'use strict';

import { apiRequest } from "./apiRequest.js";

/**
 * Tries multiple times to call an API request until it succeeds or maximum retries are reached.
 *
 * @param {string} url - The target URL to fetch from.
 * @param {number} [retries=3] - Maximum number of retry attempts.
 * @param {number} [delayMs=500] - Delay in milliseconds between retries.
 * @param {(url: string) => Promise<{success: boolean, data: any, error: string | null}>} [fn=apiRequest]
 *   Function to execute the request. Must return a Promise resolving to an object with {success, data, error}.
 *
 * @returns {Promise<{success: boolean, data: any, error: string | null}>}  
 *   Resolves with the result of the first successful request, or the final failed attempt.
 *
 * @example
 * const result = await retryApiRequest("https://api.example.com/data", 5, 1000);
 * if (result.success) {
 *   console.log("Data:", result.data);
 * } else {
 *   console.error("Error:", result.error);
 * }
 */
export const retryApiRequest = async (url, retries = 3, delayMs = 500, fn = apiRequest) => {
  for (let i = 0; i < retries; i++) {
    const result = await fn(url); 
    if (result.success) return result;
    console.warn(`Attempt ${i + 1} failed for ${url}: ${result.error}`);
    if (i < retries - 1) await new Promise(r => setTimeout(r, delayMs));
  }
  return { success: false, data: null, error: `All ${retries} attempts failed for ${url}` };
};
