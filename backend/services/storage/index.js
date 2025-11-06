import { join } from 'node:path';
import { CACHE_DIR_CODEWARS, DATA_DIR_CODEWARS } from '#config';
import { loadJSONAsObject, writeObjectToJSON } from './utils/index.js';
import { generateCryptoHash } from '#hash';
import { ProfileSimpleFields } from "#schemas";
import { getValueByPath } from "#shared-utils";

export const Storage = {
  async update({ user, data }) {
    const pathToCache = join(CACHE_DIR_CODEWARS, user, 'userProfile.hash.json');
    const pathToData = join(DATA_DIR_CODEWARS, user, 'userProfile.json');
    const oldUserCache = await this.load(pathToCache);
    const oldUserData = await this.load(pathToData);

    const delta = {};
    const deltaHash = {};
    const updateResult = {
      user,
      change: false,
      data: { delta },
      hash: { deltaHash },
    };

    const newUserProfileHash = generateCryptoHash(data);
    const oldUserProfileHash  = oldUserCache.fullHash;
    console.log(oldUserProfileHash);


    // level 1 fulHash userProfile comparable
    if (newUserProfileHash === oldUserProfileHash) {
      return updateResult;
    } else {
      updateResult.change = true;
      deltaHash.fullHash = newUserProfileHash;
    };


    // level 2 simple fileds comparable don`t use crypto hash
     ProfileSimpleFields.reduce((acc, curr) => {
       const newValue = getValueByPath(data, curr);
       const oldValue = getValueByPath(oldUserData,curr);
       if (newValue !== oldValue) {
         delta[curr] = newValue;
       }
       return acc;
     }, delta);


    //  level 3 RanksCryptoHash comprable
     const { ranks: newRanks } = data;
     const newRanksHash = generateCryptoHash(newRanks);
     const { ranks: oldRanksHash } = oldUserCache;

     if(newRanksHash === oldRanksHash) {
       return updateResult;
     };

     deltaHash.ranks = newRanksHash;

     // level 5 ranks.overall
     const overallPath = 'ranks.overall';
     const overallData = getValueByPath(data, overallPath);
     const newOverallHash = generateCryptoHash(overallData);
     const oldOverallHash = oldUserCache[overallPath];

     if (newOverallHash === oldOverallHash) {
       return updateResult;
     };

     deltaHash[overallPath] = newOverallHash;     

     for(const key in overallData) {
       const path = `${overallPath}.${key}`;
       const oldValue = getValueByPath(oldUserData, path);
       const newValue = overallData[key];
       if(newValue === oldValue) continue;
       delta[path] = newValue;
     }

     // level 6-1  ranks.languages
     const languagesPath = 'ranks.languages';
     const languagesData = getValueByPath(data, languagesPath);
     const newLanguagesHash = generateCryptoHash(languagesData);
     const oldLanguagesHash = oldUserCache[languagesPath];

     if (newLanguagesHash === oldLanguagesHash) {
       return updateResult;
     };

     deltaHash[languagesPath] = newLanguagesHash;

    // level 6-2 hash ranks.languages
    const dataLanguages = [];

    for(const key in languagesData) {
      const path = `${languagesPath}.${key}`;
      const newHash = generateCryptoHash(languagesData[key]);
      const oldHash = oldUserCache[path];
      if(newHash === oldHash) continue;
      deltaHash[path] = newHash;
      dataLanguages.push(path);
    }

    for(const category of dataLanguages) {
      const oldData = getValueByPath(oldUserData, category);
      const newData = getValueByPath(data, category);
      for(const field in newData) {
        const path = `${category}.${field}`;
        const oldData = getValueByPath(oldUserData, path);
        const newData = getValueByPath(data, path);
        if (oldData === newData) continue;
        delta[path] = newData;
      }
    };

    if(updateResult.change) {
      this.write({ filePath: pathToCache, data: { ...oldUserCache, ...updateResult.hash.deltaHash }});
      this.write({ filePath: pathToData, data: data });
    }
    console.log(updateResult);
    return updateResult;
  },

  async load(pathFile) {
    return await loadJSONAsObject(pathFile);
  },

  async write({ filePath, data }) {
    writeObjectToJSON({ filePath, dataObject: data });
  },

};
