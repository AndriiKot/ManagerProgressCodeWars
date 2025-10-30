import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export const writeObjectToJSON = async ({ filePath, dataObject }) => {
  try {
    const dir = dirname(filePath);
    await mkdir(dir, { recursive: true });
    await writeFile(filePath, JSON.stringify(dataObject, null, 2), "utf8");
  } catch (err) {
    console.error(`writeCache: Failed to write ${filePath}: ${err.message}`);
  }
};
