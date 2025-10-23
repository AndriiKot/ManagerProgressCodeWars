import { join } from "node:path";

import { makeCodewarsCacheSchemas } from "../../../shared/index.js";
import { CACHE_DIR_CODEWARS, USER_NAME } from "../../../config.js";

export const CODEWARS_CACHE_SCHEMAS = makeCodewarsCacheSchemas(
  join(CACHE_DIR_CODEWARS, USER_NAME)
);
