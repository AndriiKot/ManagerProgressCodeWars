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
    const deltaHash = { fullHash: '', fields: {}, "hash-fields": {} };
    const updateResult = {
      data: { change: false, delta },
      hash: { change: false, deltaHash },
    };

    const newUserProfileHash = generateCryptoHash(data);
    const oldUserProfileHash  = await this.load(join(userCache, 'userProfile.hash.json'));
    
    // level 1 fulHash userProfile comparable 
    const { fullHash: oldHash } = oldUserProfileHash;
    if (newUserProfileHash === oldHash) {
      return updateResult;
    } else {
      updateResult.hash.change = true;
      updateResult.data.change = true;
      deltaHash.fullHash = newUserProfileHash;
    };
    
    
    // level 2 simple fileds comparable don`t use crypto hash
    const { fields , fieldsUseHash } = CodewarsProfileCacheSchemas;

    fields.reduce((acc, curr) => {
      const newValue = getValueByPath(data, curr);
      const oldValue = oldUserProfileHash.fields[curr];
      if (newValue !== oldValue) {
        delta[curr] = newValue;
        deltaHash.fields[curr] = newValue;
        updateResult.hash.change = true;
      }
      return acc;
    }, delta);
    
    // level 3 RanksCryptoHash comprable 
    const { ranks: newRanks } = data;
    const newRanksHash = generateCryptoHash(newRanks);
    const { "hash-fields": { ranks: oldRanksHash }  } = oldUserProfileHash;

    if(newRanksHash === oldRanksHash) {
      return updateResult;
    };
   
    deltaHash["hash-fields"].ranks = newRanksHash;

    // level 4-1 ranks.overall 
    const overall = 'ranks.overall';
    const newOverall = generateCryptoHash(getValueByPath(data, overall));
    const oldOverall = oldUserProfileHash["hash-fields"][overall];

    if (newOverall === oldOverall) {
      return updateResult;
    };

    delta[overall] = getValueByPath(data, overall);
    deltaHash["hash-fields"][overall] = newOverall;
  
    // level 4-2 ranks.languages parallel 
    const languages = 'ranks.languages';
    const newLanguages = generateCryptoHash(getValueByPath(data, languages));
    const oldLanguages = oldUserProfileHash["hash-fields"][languages];
    
    if (newLanguages === oldLanguages) {
      return updateResult;
    }; 

    delta[languages] = getValueByPath(data, languages);
    deltaHash["hash-fields"][languages] = newLanguages;
  
    console.dir(updateResult, { depth: null });
                   
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
