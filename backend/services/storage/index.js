import { join } from 'node:path';
import { CACHE_DIR_CODEWARS, DATA_DIR_CODEWARS } from '#config';
import { loadJSONAsObject, writeObjectToJSON } from './utils/index.js';
import { generateCryptoHash } from '#hash';
import { ProfileSimpleFields } from "#schemas";
import { getValueByPath } from "#shared-utils";

export const Storage = {
  async update({ user, data }) {
    const oldUserCache = await this.load(join(CACHE_DIR_CODEWARS, user, 'userProfile.hash.json'));
    const oldUserData = await this.load(join(DATA_DIR_CODEWARS, user, 'userProfile.json'));

    const delta = {};
    const deltaHash = {};
    const updateResult = {
      data: { change: false, delta },
      hash: { change: false, deltaHash },
    };

    const newUserProfileHash = generateCryptoHash(data);
    const oldUserProfileHash  = oldUserCache.fullHash;


    // level 1 fulHash userProfile comparable
    if (newUserProfileHash === oldUserProfileHash) {
      return updateResult;
    } else {
      updateResult.hash.change = true;
      updateResult.data.change = true;
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

    // // level 4-1 ranks.overall
    // const overallPath = 'ranks.overall';
    // const overallData = getValueByPath(data, overallPath);
    // const newOverall = generateCryptoHash(overallData);
    // const oldOverall = oldUserProfileHash["hash-fields"][overallPath];

    // if (newOverall === oldOverall) {
    //   return updateResult;
    // };

    // for(const key in overallData) {
    //   if (overallData[key]
    // }

    // deltaHash["hash-fields"][overallPath] = newOverall;


    // // level 4-2 ranks.languages parallel
    // const languages = 'ranks.languages';
    // const newLanguages = generateCryptoHash(getValueByPath(data, languages));
    // const oldLanguages = oldUserProfileHash["hash-fields"][languages];

    // if (newLanguages === oldLanguages) {
    //   return updateResult;
    // };

    // deltaHash["hash-fields"][languages] = newLanguages;

    // console.dir(updateResult, { depth: null });

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
