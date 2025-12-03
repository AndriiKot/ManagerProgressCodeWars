'use strict';

export const serializeJsonPrimitive = (value) => {
  return JSON.stringify({ __type: typeof value, value });
};
