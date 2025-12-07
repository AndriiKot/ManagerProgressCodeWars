'use strict';

import fs from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite'; 
import { DB_SCHEMAS } from '#config';
import { sqlite } from '#db';

const { prepareDatabase } = sqlite;

const DB_FILE = join('./', 'database-test.sqlite');

export const initTestDatabase = () => {
  return prepareDatabase(DB_FILE, DB_SCHEMAS);
};

initTestDatabase();

