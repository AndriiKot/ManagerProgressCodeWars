'use strict';

const VALID_ACTIONS = Object.freeze(new Set(['insert', 'update', 'delete']));

const createUpdateSection = ({
  oldData = null,
  oldCache = null,
  pathToCache = '',
  pathToData = '',
} = {}) => {
  const delta = Object.create(null);
  const deltaHash = Object.create(null);

  const addDeltaEntry = (key, action = 'insert', data = null) => {
    if (!VALID_ACTIONS.has(action)) {
      throw new Error(
        `Invalid action: "${action}". Valid actions are: ${[
          ...VALID_ACTIONS,
        ].join(', ')}`,
      );
    }

    delta[key] = { action, data };
  };

  const addDeltaHashEntry = (key, hash) => {
    deltaHash[key] = hash;
  };

  return {
    change: false,
    data: {
      delta,
      addDeltaEntry,
    },
    hash: {
      deltaHash,
      addDeltaHashEntry,
    },
    oldData,
    oldCache,
    pathToCache,
    pathToData,
  };
};

export const createState = (user) => ({
  User: user,
  Profile: createUpdateSection(),
  Authored: createUpdateSection(),
  CodeChallenges: createUpdateSection(),
  change: false,
  ranksChange: false,
  authoredChange: false,
  challengesChange: false,
});
