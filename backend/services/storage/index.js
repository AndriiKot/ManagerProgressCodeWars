import { join } from 'node:path';
import { USER_NAME, CACHE_DIR_CODEWARS } from '#config';    
import { loadJSONtoStructure, writeJSONtoStructure } from "#storage-cache";
import { CodewarsAPI } from '#api';
import { CodewarsProfileCacheSchemas, validateWithRankCheck, userProfileSchema } from "#schemas";
import { generateCryptoHash } from "#hash";
import { getValueByPath } from '#shared-utils';

const { getUserProfile, getAllPagesCompletedChallenges } = CodewarsAPI;

const { success: isProfileSuccess, data: profileData } = await getUserProfile(USER_NAME);

if (isProfileSuccess) {
  const validationResult = validateWithRankCheck(userProfileSchema, profileData, {
    recursive: true,
    strict: true,
  });

  if (validationResult.isValid) {
    console.log(`User profile ${USER_NAME} data is valid`);
    const pathHash = join(CACHE_DIR_CODEWARS, USER_NAME, 'userProfile.hash.json');
    const newFullHashUser = generateCryptoHash(profileData);
    
    
    const profileHash = {};
    for(const fieldName in CodewarsProfileCacheSchemas) {
      const fieldConfig = CodewarsProfileCacheSchemas[fieldName];
      const fieldValue = getValueByPath(profileData, fieldConfig.field);
      profileHash[fieldName] = fieldConfig.useCryptoHash 
        ? generateCryptoHash(fieldValue) 
        : fieldValue;   
    };
    console.log(profileHash);
    const oldProfileHash = loadJSONtoStructure('./testHashProfile.json')
  }
}