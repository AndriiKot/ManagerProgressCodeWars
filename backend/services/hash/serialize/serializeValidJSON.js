import {
  serializeJsonArray,
  serializeJsonObject,
  serializeJsonPrimitive,
} from './utils/index.js';

export const serializeValidJSON = (raw) => {
  if (Array.isArray(raw)) return serializeJsonArray(raw);
  if (typeof raw === 'object' && raw !== null) return serializeJsonObject(raw);
  return serializeJsonPrimitive(raw);
};
