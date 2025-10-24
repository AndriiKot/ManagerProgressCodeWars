'use strict';

/**
 * Makes a GET request and returns unified result.
 * @param {string} url - Target URL to fetch from.
 * @returns {Promise<{success: boolean, data: any, error: string | null}>}
 */
export const apiRequest = async (url) => {
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return { success: true, data, error: null };
    } else {
      return { success: false, data: null, error: `HTTP ${res.status}: ${res.statusText}` };
    }
  } catch (err) {
    console.error(`Cannot fetch from ${url}: ${err.message}`);
    return { success: false, data: null, error: err.message };
  }
};
