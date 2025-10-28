import { join } from 'node:path';
import { USER_NAME } from '#config';    
import { loadJSONtoStructure, writeJSONtoStructure } from "#storage-cache";
import { saveToDB } from "./db/saveToDB.js";
import { CodewarsAPI } from '#api';
import { CodewarsProfileCacheSchemas, validateWithRankCheck, userProfileSchema } from "#schemas";
import { generateCryptoHash } from "#hash";

const { getUserProfile, getAllPagesCompletedChallenges } = CodewarsAPI;

const userDataObject = await getUserProfile(USER_NAME);
const { success, data } = userDataObject;

if (success) {
   const validationData = validateWithRankCheck(userProfileSchema, data, {
     recursive: true,
     strict: true,
   })
  console.log(validationData);
  if (validationData.isValid) {
    console.log("HI!");

  }
}
/*
export const getValueByPath = (obj, path) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

export const compareData = (oldData, newData) => {
  const result = {};
  const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
  
  for (const key of allKeys) {
    const oldValue = oldData[key];
    const newValue = newData[key];
    const isEqual = oldValue === newValue;
    
    result[key] = {
      change: !isEqual,
      oldData: oldValue,
      newData: newValue,
      timestamp: new Date().toISOString(),
      error: null
    };
  }
  
  return result;
};

export const storage = async (schema) => {
  const baseCacheUrl = 'testCache';
  const user = 'Krillan';

  const syncUserProfile = async (baseCacheUrl, user) => {
    const testPath = join(baseCacheUrl,'./test.json');

    const newData = {}

    const  newProfile  = await getUserProfile(user);
    const { success, data, error } = newProfile;

    if (success) {
      for (const key in schema) {
        const kategory = schema[key]; 
        const getValueKategory = getValueByPath(data, kategory.field);
        newData[key] = kategory.useCryptoHash ? generateCryptoHash(getValueKategory) : getValueKategory;
      };
    };

    const oldData = await loadJSONtoStructure(testPath);
    writeJSONtoStructure({ filePath: testPath, dataObject: newData });

    const comparison = compareData(oldData, newData);
    
    return comparison;
    
  };

  const syncRanks = async (userProfile, user) => {
    const { Ranks: { change } } = userProfile;
    if(!change) {
      console.log(userProfile);  
    };
  }

  const syncAllPagesChallenges = async (userProfile, user) => {
    const { Ranks: { change } } = userProfile;
    if(!change) {
      const newPagesData = {};
      const pages = await getAllPagesCompletedChallenges(user);
      pages.forEach((page, i) => {
        if (page.success) {
          const key = i;
          const hash = generateCryptoHash(page.data);
          newPagesData[key] = hash;
        };
      });
      console.log(newPagesData);
    };
  };

  const userProfile = await syncUserProfile(baseCacheUrl, user);

 // await syncAllPagesChallenges(userProfile, user);
 await syncRanks(userProfile, user);

};


storage(CodewarsProfileCacheSchemas);

 */