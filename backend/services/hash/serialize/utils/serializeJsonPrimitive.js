/**
 * Serialize a primitive JSON value (number, string, boolean, or null) into a JSON string.
 *
 * This function takes a primitive value that is valid in JSON and converts it
 * into a JSON string containing the type and value.
 *
 * @param {number|string|boolean|null} value - The primitive JSON value to serialize.
 * @returns {string} A JSON string representing the value with its type.
 *
 * @example
 * serializeJsonPrimitive(42);      // '{"__type":"number","value":42}'
 * serializeJsonPrimitive("hello"); // '{"__type":"string","value":"hello"}'
 * serializeJsonPrimitive(true);    // '{"__type":"boolean","value":true}'
 * serializeJsonPrimitive(null);    // '{"__type":"object","value":null}'
 */
export const serializeJsonPrimitive = (value) => {
  return JSON.stringify({ __type: typeof value, value });
};
