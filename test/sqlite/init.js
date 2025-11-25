'use strict';

import fs from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite'; 
import { DB } from '#config';
import { prepareDatabase } from '#db';


const DB_FILE = join('./', 'database-test.sqlite');
const DB_SCHEMAS = join(DB, 'schema.sql');

export const initTestDatabase = () => {
  return prepareDatabase(DB_FILE, DB_SCHEMAS);
};