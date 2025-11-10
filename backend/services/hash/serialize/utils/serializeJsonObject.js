/**
 * Serialize a plain JSON object into a JSON string with sorted top-level keys.
 *
 * This function takes a JavaScript object containing only valid JSON values
 * (primitives, arrays, nested objects, or null) and converts it into a JSON string.
 * The top-level keys of the object are sorted alphabetically to ensure consistent output.
 * All values must be valid JSON — `undefined`, `Symbol`, or functions are not allowed.
 *
 * @param {JsonObject} obj - The JSON object to serialize. Can contain primitives, arrays, nested objects, or null.
 * @returns {string} A JSON string representing the serialized object with sorted keys.
 *
 * @example
 * serializeJsonObject({ b: 2, a: 1 });
 * // '{"a":1,"b":2}'
 *
 * serializeJsonObject({ b: { y: 2, x: 1 }, a: 1 });
 * // '{"a":1,"b":{"y":2,"x":1}}'  // Nested keys are not sorted
 *
 * serializeJsonObject({ a: 1, b: null, c: [1, 2] });
 * // '{"a":1,"b":null,"c":[1,2]}'
 */
export const serializeJsonObject = (obj) => {
  const sortedTopLevel = Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
  return JSON.stringify(sortedTopLevel);
};
