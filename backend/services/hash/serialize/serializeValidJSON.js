import {
  serializeJsonArray,
  serializeJsonObject,
  serializeJsonPrimitive,
} from './utils/index.js';

/**
 * Serialize a value that comes from valid JSON (as received from API).
 *
 * @param {JsonValue} raw - The value to serialize. Must be valid JSON data.
 * @returns {string} JSON string representing the input.
 */
export const serializeValidJSON = (raw) => {
  if (Array.isArray(raw)) return serializeJsonArray(raw);
  if (typeof raw === 'object' && raw !== null) return serializeJsonObject(raw);
  return serializeJsonPrimitive(raw);
};
