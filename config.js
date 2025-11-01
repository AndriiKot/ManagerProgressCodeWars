import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const USER_NAME = "AndriiKot";
export const CACHE_DIR = join(__dirname, 'backend', 'cache');
export const CACHE_DIR_CODEWARS = join(__dirname, "backend", "cache", "codewars");
export const DATA_DIR_CODEWARS = join(__dirname, "backend", "data", "codewars");
