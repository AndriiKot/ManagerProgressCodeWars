import { deepFreeze } from '#shared-utils';

export const deepFreezeArray = (arr) => {
  if (!Array.isArray(arr)) {
    throw new TypeError("deepFreezeArray expects an array");
  }

  for (const item of arr) {
    if (item && typeof item === "object" && !Object.isFrozen(item)) {
      Array.isArray(item) ? deepFreezeArray(item) : deepFreeze(item);
    }
  }

  return Object.freeze(arr);
};

