import { deepFreezeArray } from "#shared-utils";

export const ProfileCacheSchemas = deepFreezeArray([
  "fullHash",
  "ranks",
  "ranks.overall",
  "ranks.languages",
]);