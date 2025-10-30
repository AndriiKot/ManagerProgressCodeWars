import { join } from 'node:path';
import { CACHE_DIR_CODEWARS, DATA_DIR_CODEWARS } from '#config';
import { loadJSONAsObject, writeObjectToJSON } from './utils/index.js';

export const Storage = {
  async update({ user, data }) {
    const userCache = join(CACHE_DIR_CODEWARS, user);
    const userData =  join(DATA_DIR_CODEWARS, user);
    console.log('update Storage');
    console.log(user);
    console.log(data);
    console.log(userCache);
    console.log(userData); 
     
  },

  async load(pathFile) {
    console.log('load json as object');
    loadJSONAsObject(pathFile); 
  },

  async write({ filePath, data }) {
    console.log('write Object to json');
    writeObjectToJSON({ filePath, dataObject: data });
  },

};
