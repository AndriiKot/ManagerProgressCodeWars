'use strict';

import { open, mkdir, access, constants } from 'node:fs/promises';
//import { USER_NAME } from '#config';
import { getUserCodeChallenges, getCodeChallenge } from '#services';

const USER_NAME = 'Voile';
const MAX_PAGES = 63;
const MAX_CHALLENGES = 200;
const STEPS = 200;
const INTERVAL = 15_000; //  15 sec. (optimal option)

let currentPage = 0;
let start = 0;
let end = STEPS;

await mkdir('./Challenges', { recursive: true });
await mkdir('./Challenges/errors', { recursive: true });


async function processPage() {
  console.log('Run page:', currentPage);

  if (currentPage > MAX_PAGES) {
    console.log('DONE: no more pages.');
    clearInterval(timer);
    return;
  }

  const res = await getUserCodeChallenges(USER_NAME, currentPage);
  if (!res.success) {
    console.error('Error loading page:', currentPage, res.error);
    currentPage++;
    return;
  }

  const challenges = res.data.data;
 
  const chunk = challenges.slice(start, end);
  console.log(`Slice from ${start} to ${end}, total: ${chunk.length}`);

  for (const { id } of chunk) {
    let taskExists;
    try {
      await access(`./Challenges/${id}.json`, constants.F_OK);
      taskExists = true;
    } catch { taskExists = false };
    if (taskExists) {
      console.log(`skip task ${id}`);
      continue;
    }
    const task = await getCodeChallenge(id);

    if (task.success) {
      const file = await open(`./Challenges/${id}.json`, 'w+');
      try {
        await file.write(JSON.stringify(task.data, null, 2));
      } finally {
        await file.close();
      }
    } else {
      const err = await open(`./Challenges/errors/${id}.error.json`, 'w+');
      try {
        await err.write(JSON.stringify({ error: task.error }, null, 2));
      } finally {
        await err.close();
      }
    }
  }

  start += STEPS;
  end += STEPS;

  if (end > MAX_CHALLENGES) {
    start = 0;
    end = STEPS;

    currentPage++;
  }
}

processPage();

const timer = setInterval(processPage, INTERVAL);
