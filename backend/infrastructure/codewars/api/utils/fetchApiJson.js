"use strict";

import { deepFreeze } from "#shared-utils";

export const fetchApiJson = async (url) => {
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return deepFreeze({ success: true, url, data, error: null });
    } else {
      return deepFreeze({
        success: false,
        url,
        data: null,
        error: `HTTP ${res.status}: ${res.statusText}`,
      });
    }
  } catch (err) {
    console.error(`Cannot fetch from ${url}: ${err.message}`);
    return deepFreeze({ success: false, url, data: null, error: err.message });
  }
};
