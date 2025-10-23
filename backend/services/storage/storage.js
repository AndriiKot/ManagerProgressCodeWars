import { access, mkdir, writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { generateCryptoHash } from "./cryptoUtils.js";
import { CACHE_SCHEMAS } from "../../schemas/cacheSchemas.js";

export const ensureDir = async (directoryPath) => {
  try {
    await access(directoryPath);
  } catch {
    await mkdir(directoryPath, { recursive: true });
  }
};

export const writeStructureAsJson = async ({
  directory,
  fileName,
  dataObject,
}) => {
  if (typeof dataObject !== "object" || dataObject === null) {
    throw new TypeError(
      `Data must be an object or array, but recieved type "${typeof dataObject}"`
    );
  }

  await ensureDir(directory);

  const filePath = join(directory, fileName);
  const jsonData = JSON.stringify(dataObject, null, 2);

  await writeFile(filePath, jsonData, "utf8");
};

export const loadJSONtoStructure = async (pathToFile) => {
  let result = null;

  try {
    await access(pathToFile);
    const raw = await readFile(pathToFile, "utf-8");
    result = JSON.parse(raw);
  } catch (err) {
    console.warn(`Failed to load JSON from file: ${pathToFile}`, err.message);
  }

  return result;
};

export const storage = (schema) => {
  const dir = CACHE_SCHEMAS.Path || "./cache";
  const file = schema.file;

  if (!file) throw new Error("Schema must include a 'file' property");

  const filePath = join(dir, file);

  return {
    save: (data) =>
      writeStructureAsJson({
        directory: dir,
        fileName: file,
        dataObject: data,
      }),
    load: () => loadJSONtoStructure(filePath),
  };
};

// const checkCryptoHashChanged = (key, raw) => {
//   const schema = CACHE_SCHEMAS[key];
//   const cachedData =
//     loadData(path.join(CACHE_DIR_CODEWARS, schema.userDir(), schema.file())) ??
//     {};
//   const oldHash = cachedData?.[schema.field] ?? null;

//   const newHash = generateSchemaHash(key, raw);
//   return newHash !== oldHash;
// };

// /**
//  * Build main storage API
//  */
// const storage = Object.fromEntries(
//   Object.entries(CACHE_SCHEMAS).flatMap(([key, { userDir, file, field }]) => [
//     [
//       `save${key}`,
//       (value) =>
//         saveData({
//           dir: path.join(CACHE_DIR_CODEWARS, userDir()),
//           fileName: file(),
//           data: field ? { [field]: value } : [value],
//         }),
//     ],
//     [
//       `load${key}`,
//       () =>
//         loadData(`${CACHE_DIR_CODEWARS}/${userDir()}/${file()}`)?.[field] ??
//         null,
//     ],
//   ])
// );

// storage.generateSchemaHash = generateSchemaHash;
// storage.checkCryptoHashChanged = checkCryptoHashChanged;

// export default storage;
