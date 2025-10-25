import { loadJSONtoStructure, writeJSONtoStructure } from "#storage-cache";
import { syncProfileData } from "#storage-transform";
import { saveToDB } from "./db/saveToDB.js";

export const storage = (schema) => {
  return {
    readCache,
    writeCache,
    syncProfileData: async (newData) => {
      const oldData = await loadJSONtoStructure();
      return syncProfileData({ schema, oldData, newData });
    },
    saveToDB,
  };
};

