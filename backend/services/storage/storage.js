'use strict';

import { join } from 'node:path';
import { CodewarsAPI } from '#api';
import { updateUserProfile, updateUserAuthored, updateUserCodeChallenges, createState } from '#storage';
import {
  loadJSONAsObject,
  writeObjectToJSON,
  prepareSection,
} from '#storage';

async function load(pathFile) {
  return await loadJSONAsObject(pathFile);
}

async function write({ filePath, data }) {
  writeObjectToJSON({ filePath, dataObject: data });
}

export const Storage = {
  async update({ user, data, state = createState(user) }) {
    const { Profile } = await updateUserProfile({
      user,
      data,
      state,
      load,
      write,
    });

    if (Profile.change) {
      const {
        pathToCache,
        pathToData,
        oldCache,
        hash: { deltaHash },
      } = Profile;

      write({ filePath: pathToCache, data: { ...oldCache, ...deltaHash } });
      write({ filePath: pathToData, data });
    }

    const { Authored } = await updateUserAuthored({
      user,
      state,
      load,
      write,
    });

    if (Authored.change) {
      const {
        pathToCache,
        pathToData,
        oldCache,
        hash: { deltaHash },
      } = Authored;

      write({ filePath: pathToCache, data: { ...oldCache, ...deltaHash } });
      write({ filePath: pathToData, data: Authored.oldData });
    }

    const { CodeChallenges } = await updateUserCodeChallenges({
      user,
      state,
      load,
      write,
    });

    if (CodeChallenges.change) {
      const {
        pathToCache,
        pathToData,
        oldCache,
        hash: { deltaHash },
      } = CodeChallenges;

      write({ filePath: pathToCache, data: { ...oldCache, ...deltaHash } });
      write({ filePath: pathToData, data: CodeChallenges.oldData });
    }

    console.dir({ state }, { depth: null });
  },

  async savePages({ filePath, data }) {
    const tasks = [];

    for (const key in data) {
      const page = data[key];
      tasks.push(
        write({
          filePath: join(filePath, `${key}.json`),
          data: page,
        }),
      );
    }

    await Promise.all(tasks);
  },
};
