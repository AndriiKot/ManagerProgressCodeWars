"use strict";

import { ApiResponse } from "#contracts";

export const fetchApiJson = async (url) => {
  try {
    const res = await fetch(url);

    if (res.ok) {
      const data = await res.json();
      return ApiResponse.ok(url, data);
    } else {
      return ApiResponse.fail(url, `HTTP ${res.status}: ${res.statusText}`); 
    }
  } catch (err) {
    console.error(`Cannot fetch from ${url}: ${err.message}`);
    return ApiResponse.fail(url, err.message); 
  }
};
