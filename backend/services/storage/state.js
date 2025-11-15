'use strict';

export const createUpdateSection = ({
  oldData = null,
  oldCache = null,
  pathToCache = '',
  pathToData = '',
} = {}) => {
  const delta = new Map();

  const addDeltaEntry = (key, initialData = null) => {
    const entry = { action: '', data: initialData };
    delta.set(key, entry);
    return entry;
  };

  return {
    change: false,              
    data: { delta, addDeltaEntry },
    hash: { deltaHash: {} },     
    oldData,
    oldCache,
    pathToCache,
    pathToData,
  };
};

export const updateState = (user) => ({
  User: user,
  Profile: createUpdateSection(),
  Authored: createUpdateSection(),
  CodeChallenges: createUpdateSection(),
  change: false,
  ranksChange: false,
  authoredChange: false,
  challengesChange: false,
});
