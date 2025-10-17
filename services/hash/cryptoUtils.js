import crypto from 'node:crypto';

/**
 * Генерирует sha256 хеш из строки
 */
export const sha256 = (str) =>
  crypto.createHash('sha256').update(str, 'utf8').digest('hex');

/**
 * Преобразует объект в детерминированную строку для хеширования
 * Сортирует ключи, оставляет только значимые поля
 */
export const serializeForHash = (obj, fields = null) => {
  let data = obj;
  if (fields) {
    // выбираем только нужные поля
    data = {};
    for (const field of fields) {
      if (obj[field] !== undefined) data[field] = obj[field];
    }
  }
  return JSON.stringify(data, Object.keys(data).sort());
};

