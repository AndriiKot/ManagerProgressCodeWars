import fs from "node:fs";
import path from "node:path";
import { USER_CACHE_DIR, USER_NAME } from "../../config.js";
import { generateSha256Hash, serializeObjectForHash } from "./cryptoUtils.js";
import { CACHE_SCHEMAS } from "../../schemas/cacheSchemas.js";

const ensureDir = () => {
  if (!fs.existsSync(USER_CACHE_DIR)) {
    fs.mkdirSync(USER_CACHE_DIR, { recursive: true });
  }
};

/**
 * Save data to cache file
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
 */
const loadData = (fileName) => {
  const filePath = path.join(USER_CACHE_DIR, fileName);
  return fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, "utf8"))
    : null;
};

/**
 * Check if object has changed (for entries with useCryptoHash)
 */
const hasCryptoHashChanged = (key, obj) => {
  const schema = CACHE_SCHEMAS[key];
  if (!schema?.useCryptoHash) {
    throw new Error(
      `"${key}" does not support hashing (missing useCryptoHash: true).`
    );
  }

  const serialized = serializeObjectForHash(obj);
  const newHash = generateSha256Hash(serialized);
  const oldData = loadData(schema.file());
  const oldHash = oldData?.[schema.field] ?? null;

  const changed = newHash !== oldHash;

  if (changed) {
    saveData(schema.file(), { [schema.field]: newHash });
  }

  return changed;
};

/**
 * Build the main storage API
 */
const storage = Object.fromEntries(
  Object.entries(CACHE_SCHEMAS).flatMap(([key, { file, field }]) => [
    [`save${key}`, (value) => saveData(file(), { [field]: value })],
    [`load${key}`, () => loadData(file())?.[field] ?? null],
  ])
);

/**
 * Add a universal hasCryptoHashChanged() API for crypto-based schemas
 */
storage.hasCryptoHashChanged = hasCryptoHashChanged;

export default storage;
