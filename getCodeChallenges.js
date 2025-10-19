'use strict';

import { getCompletedChallenges } from './api/codewarsAPI.js';


const getLastChallenges200 = (userName) =>
  fetch(getCompletedChallenges(userName))
    .then((res) => res.json())
    .catch((error) => {
      throw new Error(`get last code-challenges fail Error: ${error.message}`);
    });



getLastChallenges200('Krillan').then(console.log);







