import { join } from 'node:path';
import { CACHE_DIR_CODEWARS, DATA_DIR_CODEWARS } from '#config';

export const prepareSection = async (section, { user, cacheName, dataName, load }) => {
  const pathToCache = join(CACHE_DIR_CODEWARS, user, cacheName);
  const pathToData = join(DATA_DIR_CODEWARS, user, dataName);

  const oldCache = await load(pathToCache);
  const oldData = await load(pathToData);

  Object.assign(section, { oldCache, oldData, pathToCache, pathToData });
}
