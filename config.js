import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const USER_NAME = 'Krillan';
export const CACHE_DIR = join(__dirname, 'infrastructure', 'backend', 'cache');
export const CACHE_DIR_CODEWARS = join(
  __dirname,
  'backend',
  'infrastructure',
  'cache',
  'codewars',
);
export const DATA_DIR_CODEWARS = join(__dirname, 'backend', 'infrastructure', 'data', 'codewars');

export const DB_SCHEMAS = join(__dirname, 'backend', 'infrastructure', 'db', 'sqlite', 'schema', 'schema.sql');
