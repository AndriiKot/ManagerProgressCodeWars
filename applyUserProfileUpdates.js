import storage from "./services/hash/storage.js";
import {
  getAuthoredChallenges,
  getCompletedChallenges,
} from "./api/codewarsAPI.js";
import { logger } from "./logger.js";

const actions = {
  saveNormal: (field) => (username, value) => {
    storage[`save${field}`](value);
    logger.saveHash(field);
    logger.saveDB(field);
  },
  saveApi: (field, apiCall) => (username, value) => {
    storage[`save${field}`](value);
    logger.saveHash(field);
    logger.apiCall(apiCall(username));
  },
  saveHashField: (field, apiCall) => (username, value) => {
    const hash = storage.generateCryptoHash(field, value);
    storage[`save${field}`](hash);
    logger.saveHash(field);
    if (apiCall) logger.apiCall(apiCall(username));
  },
};

export const FIELD_HANDLERS = Object.freeze({
  UniquesKatas: (username, value) => {
    storage.saveUniquesKatas(value);
    logger.saveHash("UniquesKatas");
    logger.saveDB("UniquesKatas");
    logger.apiCall(getCompletedChallenges(username));
  },
  Ranks: (username, value) =>
    actions.saveHashField("Ranks", getCompletedChallenges)(username, value),
  Position: actions.saveNormal("Position"),
  Honor: actions.saveNormal("Honor"),
  AuthoredKatas: actions.saveApi("AuthoredKatas", getAuthoredChallenges),
});

export const applyUserProfileUpdates = async (username, updates) => {
  logger.start(username);

  for (const key in updates) {
    if (!updates.hasOwnProperty(key)) continue;
    const update = updates[key];
    if (!update.changed || key === "Ranks") continue;

    FIELD_HANDLERS[key]?.(username, update.value);
  }

  if (updates.Ranks?.changed) {
    FIELD_HANDLERS.Ranks(username, updates.Ranks.value);
  }

  logger.end();
};
