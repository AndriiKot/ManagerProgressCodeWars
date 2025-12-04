'use strict';

import { open } from 'node:fs/promises';
import { USER_NAME } from '#config';
    
import {
  fetchUserCodeChallenges,
  fetchCodeChallenge,
} from '#api';

const data = await fetchUserCodeChallenges(USER_NAME);

const file = await open('./test-open.txt', 'a+');

try {
  await file.write(JSON.stringify(data, null, 2));
} catch (err) {
  console.error(err);
} finally {
  file.close();
}