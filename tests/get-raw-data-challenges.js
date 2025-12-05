'use strict';

import { open, mkdir } from 'node:fs/promises';
import { USER_NAME } from '#config';
import { fetchUserCodeChallenges, fetchCodeChallenge } from '#api';

const MAX_PAGES = 21;
const MAX_CHALLENGES = 200;
const STEPS = 50;
const INTERVALE = 900_000; // 15 min

const data = await fetchUserCodeChallenges(USER_NAME, 2);

if (data.success) {
  const challenges = data.data.data;

  const first50 = challenges.slice(0, 50);

  await mkdir('./Challenges', { recursive: true });
  await mkdir('./Challenges/errors', { recursive: true });

  for (const { id } of first50) {
    const task = await fetchCodeChallenge(id);

    if (task.success) {
      const file = await open(`./Challenges/${id}.json`, 'w+');
      try {
        await file.write(JSON.stringify(task.data, null, 2));
      } finally {
        await file.close();
      }
    } else {
      const errorFile = await open(`./Challenges/errors/${id}.error.json`, 'w+');
      try {
        await errorFile.write(JSON.stringify({ error: task.error }, null, 2));
      } finally {
        await errorFile.close();
      }
    }
  }
}
