import test from "node:test";
import assert from "node:assert/strict";
import { ensureDir, writeStructureAsJson } from "./storage.js";
import { stat, rm, readFile } from "node:fs/promises";

test("ensureDir", async (t) => {
  await t.test("creates directory", async () => {
    const dirPath = "./test-dir";
    await rm(dirPath, { recursive: true, force: true }).catch(() => {});
    await ensureDir(dirPath);

    const info = await stat(dirPath);
    assert.strictEqual(info.isDirectory(), true);

    await rm(dirPath, { recursive: true, force: true }).catch(() => {});
  });
});

test("writeStructureAsJson", async (t) => {
  await t.test("writes object to JSON file", async () => {
    const dirPath = "./test-json-dir";
    const fileName = "data.json";
    const dataObject = { a: 1, b: 2, nested: { c: 3 } };

    await rm(dirPath, { recursive: true, force: true }).catch(() => {});
    await writeStructureAsJson({ directory: dirPath, fileName, dataObject });

    const fileContent = await readFile(`${dirPath}/${fileName}`, "utf8");
    assert.deepStrictEqual(JSON.parse(fileContent), dataObject);

    await rm(dirPath, { recursive: true, force: true }).catch(() => {});
  });

  await t.test("handles arrays", async () => {
    const dirPath = "./test-array-dir";
    const fileName = "data.json";
    const dataObject = [1, 2, 3];

    await rm(dirPath, { recursive: true, force: true }).catch(() => {});
    await writeStructureAsJson({ directory: dirPath, fileName, dataObject });

    const fileContent = await readFile(`${dirPath}/${fileName}`, "utf8");
    assert.deepStrictEqual(JSON.parse(fileContent), dataObject);

    await rm(dirPath, { recursive: true, force: true }).catch(() => {});
  });

  await t.test("throws on invalid types", async () => {
    const invalidValues = [null, undefined, "string", 42, true];

    for (const value of invalidValues) {
      await assert.rejects(
        async () =>
          writeStructureAsJson({
            directory: "./dir",
            fileName: "file.json",
            dataObject: value,
          }),
        {
          name: "TypeError",
          message: /Data must be an object or array/,
        }
      );
    }
  });
});
