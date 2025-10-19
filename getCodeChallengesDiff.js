'use strict';

import { getCompletedChallenges } from './api/codewarsAPI.js';


const getLastChallenges200 = (userName) =>
  fetch(getCompletedChallenges(userName))
    .then((res) => res.json())
    .catch((error) => {
      throw new Error(`get last code-challenges fail Error: ${error.message}`);
    });



const lastPage = await getLastChallenges200('Krillan');
const pages  = lastPage.totalPages;

const urls = Array.from({ length: pages }, (_, i) => `https://www.codewars.com/api/v1/users/Krillan/code-challenges/completed?page={i}`);
const results = Array.from({ length: pages });

await Promise.all(
  urls.map(async (url, i) => {
    const res = await fetch(url);
    const data = await res.json();
    results[i] = data;
  })
);

console.log(results);










