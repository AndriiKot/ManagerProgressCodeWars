import { writeJSONtoStructure } from "./writeJSONtoStructure.js";
import { readFile, unlink, rmdir } from "node:fs/promises";
import { join } from "node:path";

const testWriteJSONtoStructure = async () => {
  const dirPath = join("./tmp");
  const filePath = join(dirPath, "test.json");
  const data = { hello: "world", num: 42 };

  try {
    await writeJSONtoStructure({ filePath, dataObject: data });

    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);

    if (JSON.stringify(parsed) === JSON.stringify(data)) {
      console.log("Test passed ✅");
    } else {
      console.error("Test failed ❌");
    }
  } finally {
    try {
      await unlink(filePath);
      await rmdir(dirPath);
    } catch {
    }
  }
};

testWriteJSONtoStructure();
