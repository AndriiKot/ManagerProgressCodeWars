import { join } from 'node:path';
import { CACHE_DIR_CODEWARS, DATA_DIR_CODEWARS } from '#config';
import { loadJSONAsObject, writeObjectToJSON, prepareSection } from './utils/index.js';
import { generateCryptoHash } from '#hash';
import { ProfileSimpleFields } from '#schemas';
import { getValueByPath } from '#shared-utils';
import { CodewarsAPI } from '#api';
import { createState } from './state.js';

const { getAllPagesCompletedChallenges, getAuthoredChallenges } = CodewarsAPI;


export const Storage = {
  async updateUserProfile({ user, data, state }) {
    const { Profile } = state;
    const {
      Profile: {
        data: { delta },
      },
    } = state;
    const {
      Profile: {
        hash: { deltaHash },
      },
    } = state;

  await prepareSection(Profile, {
    user,
    cacheName: 'userProfile.hash.json',
    dataName: 'userProfile.json',
    load: this.load.bind(this),
  });
 

    
    const newUserProfileHash = generateCryptoHash(data);
    const oldUserProfileHash = Profile.oldCache.fullHash;

    // level 1 fulHash userProfile comparable
    if (newUserProfileHash === oldUserProfileHash) {
      return state;
    } else {
      Profile.change = true;
      deltaHash.fullHash = newUserProfileHash;
    }

    // level 2 simple fileds comparable don`t use crypto hash
    ProfileSimpleFields.reduce((acc, curr) => {
      const newValue = getValueByPath(data, curr);
      const oldValue = getValueByPath(oldUserData, curr);
      if (newValue !== oldValue) {
        delta[curr] = newValue;
      }
      return acc;
    }, delta);

    //  level 3 RanksCryptoHash comprable
    const { ranks: newRanks } = data;
    const newRanksHash = generateCryptoHash(newRanks);
    const { ranks: oldRanksHash } = oldUserCache;

    if (newRanksHash === oldRanksHash) {
      return state;
    }

    deltaHash.ranks = newRanksHash;
    state.ranksChange = true;

    // level 5 ranks.overall
    const overallPath = 'ranks.overall';
    const overallData = getValueByPath(data, overallPath);
    const newOverallHash = generateCryptoHash(overallData);
    const oldOverallHash = oldUserCache[overallPath];

    if (newOverallHash === oldOverallHash) {
      return state;
    }

    deltaHash[overallPath] = newOverallHash;

    for (const key in overallData) {
      const path = `${overallPath}.${key}`;
      const oldValue = getValueByPath(oldUserData, path);
      const newValue = overallData[key];
      if (newValue === oldValue) continue;
      delta[path] = newValue;
    }

    // level 6-1  ranks.languages
    const languagesPath = 'ranks.languages';
    const languagesData = getValueByPath(data, languagesPath);
    const newLanguagesHash = generateCryptoHash(languagesData);
    const oldLanguagesHash = oldUserCache[languagesPath];

    if (newLanguagesHash === oldLanguagesHash) {
      return state;
    }

    deltaHash[languagesPath] = newLanguagesHash;

    // level 6-2 hash ranks.languages
    const dataLanguages = [];

    for (const key in languagesData) {
      const path = `${languagesPath}.${key}`;
      const newHash = generateCryptoHash(languagesData[key]);
      const oldHash = oldUserCache[path];
      if (newHash === oldHash) continue;
      deltaHash[path] = newHash;
      dataLanguages.push(path);
    }

    for (const category of dataLanguages) {
      const oldData = getValueByPath(oldUserData, category);
      const newData = getValueByPath(data, category);
      for (const field in newData) {
        const path = `${category}.${field}`;
        const oldData = getValueByPath(oldUserData, path);
        const newData = getValueByPath(data, path);
        if (oldData === newData) continue;
        delta[path] = newData;
      }
    }

    return state;
  },

  async updateUserAuthored({ user, state }) {
    const { Authored } = state;

    const {
      data: { delta },
      hash: { deltaHash },
    } = Authored;

    const pathToCache = join(
      CACHE_DIR_CODEWARS,
      user,
      'userAuthored.hash.json',
    );

    const pathToData = join(DATA_DIR_CODEWARS, user, 'userAuthored.json');

    const oldCache = await this.load(pathToCache);
    const oldData = await this.load(pathToData);

    Object.assign(Authored, {
      pathToCache: pathToCache,
      pathToData: pathToData,
      oldCache: oldCache,
      oldData: oldData,
    });

    const newData = await getAuthoredChallenges(user);

    const newFullHash = generateCryptoHash(newData.data);
    const oldFullHash = oldCache.fullHash;
    if (newFullHash === oldFullHash) return state;

    state.change = true;
    state.authoredChange = true;
    state.Authored.change = true;
    deltaHash.fullHash = newFullHash;

    const katas = newData.data.data;
    katas.forEach((kata, i, arr) => {
      const { id } = kata;
      const newHash = generateCryptoHash(id);
      const oldHash = oldCache[id];
      if (newHash === oldHash) return;
      if (oldHash === undefined) {
        delta[id] = { action: 'insert', data: kata };
      } else {
        delta[id] = { action: 'update', data: kata };
      }
      deltaHash[id] = newHash;
    });

    // check delete katas;
    const oldKatas = oldData;
    const ids = katas.map((kata) => kata.id);
    for (const id in oldKatas) {
      if (ids.includes(id)) continue;
      delete oldKatas[id];
      delta[id] = { action: 'delete' };
    }
    return state;
  },

  async updateUserCodeChallenges({ user }) {
    const pathToCache = join(
      CACHE_DIR_CODEWARS,
      user,
      'code-challenges/code-challenges.hash.json',
    );
    const pathToPages = join(DATA_DIR_CODEWARS, user, 'code-challenges/pages/');

    const oldCodeChallenges = await this.load(pathToCache);

    const delta = {};
    const deltaHash = {};
    const updateResult = {
      user,
      change: false,
      data: { delta },
      hash: { deltaHash },
      oldCache: oldCodeChallenges,
      pathToCache,
      pathToPages,
    };

    const pages = await getAllPagesCompletedChallenges(user);
    pages.forEach((page, index, arr) => {
      const oldHash = oldCodeChallenges[index];
      const newHash = generateCryptoHash(page);
      if (newHash !== oldHash) {
        updateResult.change = true;
        deltaHash[index] = newHash;
        delta[index] = page;
      }
    });
    return updateResult;
  },

  async update({ user, data, state = createState(user) }) {
    const { Profile } = await this.updateUserProfile({ user, data, state });

    if (Profile.change) {
      const {
        pathToCache,
        pathToData,
        oldCache,
        hash: { deltaHash },
      } = Profile;

      this.write({
        filePath: pathToCache,
        data: { ...oldCache, ...deltaHash },
      });

      this.write({ filePath: pathToData, data: data });
    }

    const { Authored } = await this.updateUserAuthored({ user, state });
    if (Authored.change) {
      const {
        pathToCache,
        pathToData,
        oldCache,
        hash: { deltaHash },
      } = Authored;

      this.write({
        filePath: pathToCache,
        data: { ...oldCache, ...deltaHash },
      });
    }

    /*
    if (updateUserProfile.ranksChange) {
      const updateUserCodeChallenges = await this.updateUserCodeChallenges(
        updateUserProfile,
      );
      const {
        pathToCache,
        oldCache,
        pathToPages,
        data: { delta },
        hash: { deltaHash },
      } = updateUserCodeChallenges;
      this.write({
        filePath: pathToCache,
        data: { ...oldCache, ...deltaHash },
      });
      //this.savePages({ filePath: pathToPages, data: delta });
    }
    */
    console.dir({ state }, { depth: null });
  },

  async savePages({ filePath, data }) {
    const tasks = [];
    for (const key in data) {
      const page = data[key];
      const pagePath = join(filePath, `${key}.json`);
      tasks.push(this.write({ filePath: pagePath, data: page }));
    }

    await Promise.all(tasks);
  },

  async load(pathFile) {
    return await loadJSONAsObject(pathFile);
  },

  async write({ filePath, data }) {
    writeObjectToJSON({ filePath, dataObject: data });
  },
};
