import { join } from 'node:path';
import { CACHE_DIR_CODEWARS, DATA_DIR_CODEWARS } from '#config';
import { loadJSONAsObject, writeObjectToJSON } from './utils/index.js';
import { generateCryptoHash } from '#hash';
import { CodewarsProfileCacheSchemas } from "#schemas";
import { getValueByPath } from "#shared-utils";

export const Storage = {
  async update({ user, data }) {
    const userCache = join(CACHE_DIR_CODEWARS, user);
    const userData =  join(DATA_DIR_CODEWARS, user);
    const delta = {};

    const newUserProfileHash = generateCryptoHash(data);
    const oldUserProfileHash = await this.load(join(userCache, 'userProfile.hash.json'));

    if (newUserProfileHash === oldUserProfileHash) {
      return { change: false, delta };
    };

    const { fields , fieldsUseHash } = CodewarsProfileCacheSchemas;

    fields.reduce((acc, curr) => {
      const newValue = getValueByPath(data, curr);
      const oldValue = oldUserProfileHash.fields[curr];
      if (newValue !== oldValue) {
        acc[curr] = newValue;
      }
      return acc;
    }, delta);
    console.dir(delta);
  },

  async load(pathFile) {
    console.log('load json as object');
    return await loadJSONAsObject(pathFile);
  },

  async write({ filePath, data }) {
    console.log('write Object to json');
    writeObjectToJSON({ filePath, dataObject: data });
  },

};
