import { prepareSection, loadJSONAsObject } from '#storage';
import { getValueByPath } from '#utils';
import { generateCryptoHash } from '#hash';
import { createState } from '../state.js';
import { userProfileSchema, validateWithRankCheck, ProfileSimpleFields } from '#schemas';
import profileData from './userTest.json' with { type: 'json' };

const USER_NAME = 'TestUser';

    const validationResult = validateWithRankCheck({
      schema: userProfileSchema,
      data: profileData,
      options: {
        recursive: true,
        strict: true,
      }});

    if (validationResult.isValid) {
      console.log(`user profile ${USER_NAME} data is valid!`);
     //  await Storage.update({ user: USER_NAME, data: profileData });
    }


async function load(pathFile) {
  return await loadJSONAsObject(pathFile);
}

const state =  createState('TestUser');
// console.log(JSON.stringify(state, null, 2));
// console.log(profileData);



const updateUserProfile = async ({ user, data, state, load }) => {
  const { Profile } = state;
  const {
    Profile: {
      data: { delta },
      hash: { deltaHash },
    },
  } = state;

  await prepareSection(Profile, {
    user,
    cacheName: 'userProfile.hash.json',
    dataName: 'userProfile.json',
    load,
  });

  const newUserProfileHash = generateCryptoHash(data);
  const oldUserProfileHash = Profile.oldCache.fullHash;

  if (newUserProfileHash === oldUserProfileHash) {
    return state;
  } else {
    Profile.change = true;
    deltaHash.fullHash = newUserProfileHash;
  }

  ProfileSimpleFields.reduce((acc, curr) => {
    const newValue = getValueByPath(data, curr);
    const oldValue = getValueByPath(Profile.oldData, curr);
    if (newValue !== oldValue) {
      delta[curr] = newValue;
    }
    return acc;
  }, delta);

  const { ranks: newRanks } = data;
  const newRanksHash = generateCryptoHash(newRanks);
  const { ranks: oldRanksHash } = Profile.oldCache;

  if (newRanksHash !== oldRanksHash) {
    deltaHash.ranks = newRanksHash;
    state.ranksChange = true;
  }

  const overallPath = 'ranks.overall';
  const overallData = getValueByPath(data, overallPath);
  const newOverallHash = generateCryptoHash(overallData);
  const oldOverallHash = getValueByPath(Profile.oldCache, overallPath);

  if (newOverallHash !== oldOverallHash) {
    deltaHash[overallPath] = newOverallHash;

    for (const key in overallData) {
      const path = `${overallPath}.${key}`;
      const oldValue = getValueByPath(Profile.oldData, path);
      const newValue = overallData[key];
      if (newValue !== oldValue) {
        delta[path] = newValue;
      }
    }
  }

  const languagesPath = 'ranks.languages';
  const languagesData = getValueByPath(data, languagesPath);
  const newLanguagesHash = generateCryptoHash(languagesData);
  const oldLanguagesHash = getValueByPath(Profile.oldCache, languagesPath);

  if (newLanguagesHash !== oldLanguagesHash) {
    deltaHash[languagesPath] = newLanguagesHash;

    const dataLanguages = [];

    for (const key in languagesData) {
      const path = `${languagesPath}.${key}`;
      const newHash = generateCryptoHash(languagesData[key]);
      const oldHash = getValueByPath(Profile.oldCache, path);
      if (newHash !== oldHash) {
        deltaHash[path] = newHash;
        dataLanguages.push(path);
      }
    }

    for (const category of dataLanguages) {
      const oldCategoryData = getValueByPath(Profile.oldData, category);
      const newCategoryData = getValueByPath(data, category);
      for (const field in newCategoryData) {
        const path = `${category}.${field}`;
        const oldValue = oldCategoryData[field];
        const newValue = newCategoryData[field];
        if (newValue !== oldValue) {
          delta[path] = newValue;
        }
      }
    }
  }

  return state;
};

console.log(await updateUserProfile({ user: USER_NAME, data: profileData, state: state, load: load }));
