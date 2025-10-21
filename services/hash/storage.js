import fs from "node:fs";
import path from "node:path";
import { CACHE_DIR_CODEWARS } from "../../config.js";
import { generateCryptoHash } from "./cryptoUtils.js";
import { CACHE_SCHEMAS } from "../../schemas/cacheSchemas.js";

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const saveData = ({ dir, fileName, data }) => {
  ensureDir(dir);
  fs.writeFileSync(
    path.join(dir, fileName),
    JSON.stringify(data, null, 2),
    "utf8"
  );
};

const loadData = (pathToFile) => {
  return fs.existsSync(pathToFile)
    ? JSON.parse(fs.readFileSync(pathToFile, "utf8"))
    : null;
};

const generateSchemaHash = (key, raw) => {
  const schema = CACHE_SCHEMAS[key];
  if (!schema?.useCryptoHash) {
    throw new Error(`"${key}" does not support hashing (useCryptoHash: true)`);
  }

  return generateCryptoHash(raw);
};

const checkCryptoHashChanged = (key, raw) => {
  const schema = CACHE_SCHEMAS[key];
  const cachedData =
    loadData(path.join(CACHE_DIR_CODEWARS, schema.userDir(), schema.file())) ??
    {};
  const oldHash = cachedData?.[schema.field] ?? null;

  const newHash = generateSchemaHash(key, raw);
  return newHash !== oldHash;
};

/**
 * Build main storage API
 */
const storage = Object.fromEntries(
  Object.entries(CACHE_SCHEMAS).flatMap(([key, { userDir, file, field }]) => [
    [
      `save${key}`,
      (value) =>
        saveData({
          dir: path.join(CACHE_DIR_CODEWARS, userDir()),
          fileName: file(),
          data: field ? { [field]: value } : [value],
        }),
    ],
    [
      `load${key}`,
      () =>
        loadData(`${CACHE_DIR_CODEWARS}/${userDir()}/${file()}`)?.[field] ??
        null,
    ],
  ])
);

storage.generateSchemaHash = generateSchemaHash;
storage.checkCryptoHashChanged = checkCryptoHashChanged;

export default storage;
