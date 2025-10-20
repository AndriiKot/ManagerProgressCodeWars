"use strict";

import { getCompletedChallenges } from "./api/codewarsAPI.js";
import { generateSha256Hash } from "./services/hash/cryptoUtils.js";

const getLastChallenges200 = (userName) =>
  fetch(getCompletedChallenges(userName))
    .then((res) => res.json())
    .catch((error) => {
      throw new Error(`get last code-challenges fail Error: ${error.message}`);
    });

const lastPage = await getLastChallenges200("Krillan");
const pages = lastPage.totalPages;

const urls = Array.from(
  { length: pages },
  (_, i) =>
    `https://www.codewars.com/api/v1/users/Krillan/code-challenges/completed?page=${i}`
);

const results = Array.from({ length: pages }, () => {});

// await Promise.all(
//   urls.map(async (url, i) => {
//     const res = await fetch(url);
//     const data = await res.json();
//     results[i] = data;
//   })
// );

const hashes = Array.from({ length: pages }, () => {});

// await Promise.all(
//   results.map(async (pageData, pageIndex) => {
//     const challenges = pageData.data;
//     const serialized = JSON.stringify(challenges);
//     const hash = generateSha256Hash(serialized);
//     hashes[pageIndex] = hash;
//   })
// );

// !!! TESTING ONLY !!!
import fs from "node:fs";
import path from "node:path";
/**
 * Ensure cache directory exists
 */
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/**
 * Save data to cache file
 * @param {string} fileName
 * @param {any} data
 */
const saveData = ({ dir, fileName, data }) => {
  ensureDir(dir);
  fs.writeFileSync(
    path.join(dir, fileName),
    JSON.stringify(data, null, 2),
    "utf8"
  );
};

// saveData({
//   dir: "diff",
//   fileName: "code-challenges-hashes-2.json",
//   data: hashes,
// });
/**
 * Load data from cache file
 * @param {string} fileName
 * @returns {any|null} Parsed JSON or null if file does not exist
 */
const loadData = (pathToFile) => {
  return fs.existsSync(pathToFile)
    ? JSON.parse(fs.readFileSync(pathToFile, "utf8"))
    : null;
};

const oldHashes = loadData(path.join("diff", "code-challenges-hashes-1.json"));
const newHashes = loadData(path.join("diff", "code-challenges-hashes-3.json"));

const pagesWithDiff = [];
if (oldHashes.length === newHashes.length) {
  for (let i = -1; i >= -oldHashes.length; i--) {
    if (oldHashes.at(i) !== newHashes.at(i)) {
      pagesWithDiff.push(i);
    }
  }
} else {
  const steps = Math.max(oldHashes.length, newHashes.length);
  for (let i = -1; i >= -steps; i--) {
    if (oldHashes.at(i) !== newHashes.at(i)) {
      pagesWithDiff.push(i);
    }
  }
}

console.log(pagesWithDiff);
// !!! TESTING ONLY !!!
