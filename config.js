import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const ROOT_DIR = __dirname;            
const BACKEND_DIR = join(ROOT_DIR, 'backend');
const INFRA_DIR = join(BACKEND_DIR, 'infrastructure');

export const USER_NAME = 'AndriiKot';
export const FRIENDS = [...new Set(['Krillan','Voile'])];
export const MAX_USERS = 10;

export const CACHE_DIR = join(INFRA_DIR, 'cache');
export const CACHE_DIR_CODEWARS = join(CACHE_DIR, 'codewars');

export const DATA_DIR_CODEWARS = join(INFRA_DIR, 'data', 'codewars');
export const CHALLENGES_RANKED = join(DATA_DIR_CODEWARS, 'Challenges/ranked');
export const CHALLENGES_REFERENCE = join(DATA_DIR_CODEWARS, 'Challenges/reference');

export const DB_BASE = join(INFRA_DIR, 'db', 'sqlite');
export const DB_SCHEMAS = join(DB_BASE, 'schema', 'schema.sql');
export const DB_FILE = join(DB_BASE, 'database.sqlite');
