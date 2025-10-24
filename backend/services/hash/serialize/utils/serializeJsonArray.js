/**
 * Serialize a JSON array into a JSON string.
 *
 * This function takes a JavaScript array containing only valid JSON values
 * (primitives, objects, arrays, or null) and converts it into a JSON string.
 * All elements must be valid JSON — `undefined`, `Symbol`, or functions are not allowed.
 *
 * @param {JsonValue[]} arr - The JSON array to serialize. Can contain primitives, objects, nested arrays, or null.
 * @returns {string} A JSON string representing the serialized array.
 *
 * @example
 * serializeJsonArray([1, 2, 3]); 
 * // "[1,2,3]"
 *
 * serializeJsonArray([{ a: 1 }, { b: 2 }]); 
 * // '[{"a":1},{"b":2}]'
 *
 * serializeJsonArray([true, null, ["nested", 42]]); 
 * // '[true,null,["nested",42]]'
 */
export const serializeJsonArray = (arr) => JSON.stringify(arr);
