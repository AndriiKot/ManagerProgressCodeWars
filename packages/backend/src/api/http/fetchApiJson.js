"use strict";

import { SHARED } from '#config';

const sharedPath = `${SHARED}`;

export const fetchApiJson = async (url) => {
  // динамически импортируем deepFreeze
  const { deepFreeze } = await import(sharedPath);

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
