'use strict';

export const serializeJsonObject = (obj) => {
  const sortedTopLevel = Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
  return JSON.stringify(sortedTopLevel);
};
