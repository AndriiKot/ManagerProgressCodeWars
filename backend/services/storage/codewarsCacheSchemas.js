import { join } from "node:path";

import { makeCodewarsCacheSchemas } from "#shared";
import { CACHE_DIR_CODEWARS, USER_NAME } from "#config";

export const CODEWARS_CACHE_SCHEMAS = makeCodewarsCacheSchemas(
  join(CACHE_DIR_CODEWARS, USER_NAME)
);
