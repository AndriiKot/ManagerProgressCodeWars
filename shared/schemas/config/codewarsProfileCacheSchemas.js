import { deepFreezeArray } from "#shared-utils";

export const CodewarsProfileCacheSchemas = deepFreezeArray([
  "fullHash",
  "ranks",
  "ranks.overall",
  "ranks.languages",
]);