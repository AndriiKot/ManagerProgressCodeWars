"use strict";

import test from "node:test";
import { getCompletedChallenges } from "./api/codewarsAPI.js";
import { USER_NAME } from "./config.js";
import { generateSha256Hash } from "./services/hash/cryptoUtils.js";

export const getCodeChallengesDiff = async () => {
  const url = getCompletedChallenges(USER_NAME);
  const lastPage = await fetch(url)
    .then((res) => res.json())
    .catch((error) => {
      throw new Error(`get last code-challenges fail Error: ${error.message}`);
    });
  const countPages = lastPage.totalPages;

  const urls = Array.from({ length: countPages }, (_, i) => `${url}?page=${i}`);
  const pages = Array.from({ length: countPages }, () => ({}));
  const newHashes = Array.from({ length: countPages }, () => ({}));
  const oldHashes = Array.from({ length: countPages }, () => ({ test: "old" }));
  const pagesWithDiff = [];

  await Promise.all(
    urls.map(async (url, i) => {
      const res = await fetch(url);
      const data = await res.json();
      pages[i] = data;
    })
  );

  await Promise.all(
    results.map(async (pageData, pageIndex) => {
      const challenges = pageData.data;
      const serialized = JSON.stringify(challenges);
      const hash = generateSha256Hash(serialized);
      newHashes[pageIndex] = hash;
    })
  );

  const steps = Math.max(oldHashes.length, newHashes.length);
  for (let i = -1; i >= -steps; i--) {
    if (oldHashes.at(i) !== newHashes.at(i)) {
      pagesWithDiff.push(i);
    }
  }
};
getCodeChallengesDiff();

