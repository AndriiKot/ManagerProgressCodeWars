import fs from "node:fs";
import path from "node:path";
import { USER_CACHE_DIR } from "../../config.js";
import { generateSha256Hash, serializeObjectForHash } from "./cryptoUtils.js";
import { CACHE_SCHEMAS } from "../../schemas/cacheSchemas.js";

/**
 * Ensure cache directory exists
 */
const ensureDir = () => {
  if (!fs.existsSync(USER_CACHE_DIR)) {
    fs.mkdirSync(USER_CACHE_DIR, { recursive: true });
  }
};

/**
 * Save data to cache file
 * @param {string} fileName
 * @param {any} data
 */
const saveData = (fileName, data) => {
  ensureDir();
  fs.writeFileSync(
    path.join(USER_CACHE_DIR, fileName),
    JSON.stringify(data, null, 2),
    "utf8"
  );
};

/**
 * Load data from cache file
 * @param {string} fileName
 * @returns {any|null} Parsed JSON or null if file does not exist
 */
const loadData = (fileName) => {
  const filePath = path.join(USER_CACHE_DIR, fileName);
  return fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, "utf8"))
    : null;
};

/**
 * Generate SHA256 hash for an object (pure function, does not write)
 * @param {string} key - schema key
 * @param {any} obj - object to hash
 * @returns {string} SHA256 hash
 */
const generateCryptoHash = (key, obj) => {
  const schema = CACHE_SCHEMAS[key];
  if (!schema?.useCryptoHash) {
    throw new Error(`"${key}" does not support hashing (useCryptoHash: true)`);
  }

  const serialized = serializeObjectForHash(obj);
  return generateSha256Hash(serialized);
};

/**
 * Check if a hashed object has changed (pure function)
 * @param {string} key
 * @param {any} obj
 * @returns {boolean} true if object has changed
 */
const checkCryptoHashChanged = (key, obj) => {
  const schema = CACHE_SCHEMAS[key];
  const cachedData = loadData(schema.file()) ?? {};
  const oldHash = cachedData?.[schema.field] ?? null;

  const newHash = generateCryptoHash(key, obj);
  return newHash !== oldHash;
};

/**
 * Build main storage API
 */
const storage = Object.fromEntries(
  Object.entries(CACHE_SCHEMAS).flatMap(([key, { file, field }]) => [
    [`save${key}`, (value) => saveData(file(), { [field]: value })],
    [`load${key}`, () => loadData(file())?.[field] ?? null],
  ])
);

storage.generateCryptoHash = generateCryptoHash;
storage.checkCryptoHashChanged = checkCryptoHashChanged;

export default storage;
