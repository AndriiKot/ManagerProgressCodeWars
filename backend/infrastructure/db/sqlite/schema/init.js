'use strict';

import fs from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite'; 
import { DB_SCHEMAS, DB_FILE } from '#config';
import { sqlite } from '#db';

const { prepareDatabase } = sqlite;


export const initDatabase = () => {
  return prepareDatabase(DB_FILE, DB_SCHEMAS); 
};