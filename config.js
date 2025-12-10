import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const USER_NAME = 'AndriiKot';

export const FRIENDS = ([...new Set(['Krillan'])]);

export const MAX_USERS = 10; 

export const CACHE_DIR = join(__dirname, 'infrastructure', 'backend', 'cache');
export const CACHE_DIR_CODEWARS = join(
  __dirname,
  'backend',
  'infrastructure',
  'cache',
  'codewars',
);

export const DATA_DIR_CODEWARS = join(__dirname, 'backend', 'infrastructure', 'data', 'codewars');
export const CHALLENGES_DIR = join(
  __dirname,
  'backend',
  'infrastructure',
  'data',
  'codewars',
  'Challenges'
);

export const DB_SCHEMAS = join(__dirname, 'backend', 'infrastructure', 'db', 'sqlite', 'schema', 'schema.sql');
export const DB_FILE = join(__dirname, 'backend', 'infrastructure', 'db', 'sqlite', 'database.sqlite');

