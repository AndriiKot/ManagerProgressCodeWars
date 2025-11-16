import { join } from 'node:path';
import { CACHE_DIR_CODEWARS, DATA_DIR_CODEWARS } from '#config';
import {
  loadJSONAsObject,
  writeObjectToJSON,
  prepareSection,
} from './utils/index.js';
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

    // level 1 fullHash
    if (newUserProfileHash === oldUserProfileHash) {
      return state;
    } else {
      Profile.change = true;
      deltaHash.fullHash = newUserProfileHash;
    }

    // level 2 simple fields
    ProfileSimpleFields.reduce((acc, curr) => {
      const newValue = getValueByPath(data, curr);
      const oldValue = getValueByPath(Profile.oldData, curr);
      if (newValue !== oldValue) {
        delta[curr] = newValue;
      }
      return acc;
    }, delta);

    // level 3 ranks hash
    const { ranks: newRanks } = data;
    const newRanksHash = generateCryptoHash(newRanks);
    const { ranks: oldRanksHash } = Profile.oldCache;

    if (newRanksHash !== oldRanksHash) {
      deltaHash.ranks = newRanksHash;
      state.ranksChange = true;
    }

    // level 5 ranks.overall
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

    // level 6-1 ranks.languages
    const languagesPath = 'ranks.languages';
    const languagesData = getValueByPath(data, languagesPath);
    const newLanguagesHash = generateCryptoHash(languagesData);
    const oldLanguagesHash = getValueByPath(Profile.oldCache, languagesPath);

    if (newLanguagesHash !== oldLanguagesHash) {
      deltaHash[languagesPath] = newLanguagesHash;

      // level 6-2 hash ranks.languages
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
  },

  async updateUserAuthored({ user, state }) {
    const { Authored } = state;
    const {
      data: { delta },
      hash: { deltaHash },
    } = Authored;

    await prepareSection(Authored, {
      user,
      cacheName: 'userAuthored.hash.json',
      dataName: 'userAuthored.json',
      load: this.load.bind(this),
    });

    const newData = await getAuthoredChallenges(user);

    const newFullHash = generateCryptoHash(newData.data);
    const oldFullHash = Authored.oldCache.fullHash;

    if (newFullHash === oldFullHash) return state;

    state.change = true;
    state.authoredChange = true;
    Authored.change = true;
    deltaHash.fullHash = newFullHash;

    const katas = newData.data.data;
    katas.forEach((kata) => {
      const { id } = kata;
      const newHash = generateCryptoHash(id);
      const oldHash = Authored.oldCache[id];
      if (newHash === oldHash) return;
      if (oldHash === undefined) {
        delta[id] = { action: 'insert', data: kata };
      } else {
        delta[id] = { action: 'update', data: kata };
      }
      deltaHash[id] = newHash;
    });

    // check delete katas
    const oldKatas = Authored.oldData;
    const ids = katas.map((kata) => kata.id);
    for (const id in oldKatas) {
      if (ids.includes(id)) continue;
      delete oldKatas[id];
      delta[id] = { action: 'delete' };
    }

    return state;
  },

  async updateUserCodeChallenges({ user, state }) {
    const { CodeChallenges } = state;

    const {
      data: { delta },
      hash: { deltaHash },
    } = CodeChallenges;

    await prepareSection(CodeChallenges, {
      user,
      cacheName: 'code-challenges/code-challenges.hash.json',
      dataName: 'code-challenges/pages/',
      load: this.load.bind(this),
    });

    const pages = await getAllPagesCompletedChallenges(user);

    const newFullHash = generateCryptoHash(pages);
    const oldFullHash = CodeChallenges.oldCache.fullHash;

    if (newFullHash === oldFullHash) return state;

    state.change = true;
    CodeChallenges.change = true;
    deltaHash.fullHash = newFullHash;

    pages.forEach((page, index) => {
      const newHash = generateCryptoHash(page);
      const oldHash = CodeChallenges.oldCache[index];
      if (newHash === oldHash) return;

      deltaHash[index] = newHash;
      delta[index] = page;
    });

    const oldPages = CodeChallenges.oldData;
    const indices = pages.map((_, i) => i.toString());
    for (const key in oldPages) {
      if (indices.includes(key)) continue;
      delete oldPages[key];
      delta[key] = { action: 'delete' };
    }

    return state;
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
