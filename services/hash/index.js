import { sha256, serializeForHash } from './cryptoUtils.js';
import { USER_FIELDS, CHALLENGE_FIELDS } from './fieldSelectors.js';
import { saveHash, loadHash } from './storage.js';

/**
 * Вычисляет хеш для объекта с выборкой полей
 */
export const computeHash = (obj, fields = null) => {
  const serialized = serializeForHash(obj, fields);
  return sha256(serialized);
};

/**
 * Проверяет, изменился ли объект
 */
export const hasChanged = (name, obj, fields = null) => {
  const newHash = computeHash(obj, fields);
  const oldHash = loadHash(name);
  const changed = newHash !== oldHash;
  if (changed) saveHash(name, newHash);
  return changed;
};

