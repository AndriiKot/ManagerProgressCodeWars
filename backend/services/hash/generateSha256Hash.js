import crypto from 'node:crypto';

/**
 * Generate a SHA-256 hash from a string.
 *
 * This function computes the SHA-256 hash of the given string
 * and returns it as a hexadecimal string.
 *
 * @param {string} str - The input string to hash.
 * @returns {string} The hexadecimal representation of the SHA-256 hash.
 *
 * @example
 * const hash = generateSha256Hash("hello world");
 * console.log(hash); // e.g., "a948904f2f0f479b8f8197694b30184b0d2e42f..."
 */
export const generateSha256Hash = (str) => {
  const hash = crypto.createHash('sha256');
  hash.update(str, 'utf8');
  return hash.digest('hex');
};
