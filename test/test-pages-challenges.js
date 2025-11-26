'use strict';

import { USER_NAME } from '#config';
import {
  fetchUserProfile,
  fetchUserCodeChallenges,
  fetchUserAuthored,
  fetchCodeChallenge,
} from '#codewars';

const { dir, log } = console;

/*
const { data: { totalPages: count }} = await fetchUserCodeChallenges(USER_NAME, 0);

const promises = Array.from({ length: count }, (_, i) => {
    return fetchUserCodeChallenges(USER_NAME, i);
});

const pagesData = await Promise.all(promises);

const allChallenges = pagesData.flatMap(page => page.data.data);
const ids = allChallenges.flatMap(obj => obj.id);

const testChallenge = await fetchCodeChallenge('5899dc03bc95b1bf1b0000ad');
log(testChallenge);
*/
{
  const pageData = await fetchUserCodeChallenges(USER_NAME, 16);
  const allChallenges = pageData.data.data;
  const ids = allChallenges.flatMap(obj => obj.id);

  const promisesChallenges = Array.from({ length: ids.length }, (_, i) => {
    return fetchCodeChallenge(ids[i]);
  })

  const challengesData = await Promise.all(promisesChallenges);
  dir(challengesData.length);
  const notValid = challengesData.filter(el => !el.isValid);
  const valid = challengesData.filter(el => el.isValid);
  dir({ valid: valid.length });
  dir({ notValid: notValid.length })
  log('\n\n');

}
/*
cconst promisesChallenges = Array.from({ length: ids.length }, (_, i) => {
  fetchCodeChallenge(ids[i]);
})





const testValidation = challengesData.map((obj) => obj.isValid);
const validCount = testValidation.filter((el) => el).length;
const notValidCount = testValidation.length - validCount;


dir({ totalCount: testValidation.length, valid: validCount, notValid: notValidCount }); // { totalCount: 4377, valid: 366, notValid: 4011 }
*/



