'use strict';

import { open, mkdir } from 'node:fs/promises';
//import { USER_NAME } from '#config';
import { fetchUserCodeChallenges, fetchCodeChallenge } from '#api';

const USER_NAME = 'Voile';
const MAX_PAGES = 63;
const MAX_CHALLENGES = 200;
const STEPS = 50;
const INTERVAL = 15_000; //  15 sec.

let currentPage = 19;
let start = 0;
let end = STEPS;

await mkdir('./Challenges', { recursive: true });
await mkdir('./Challenges/errors', { recursive: true });

async function processPage() {
  console.log('Run page:', currentPage);

  // --- остановка ---
  if (currentPage > MAX_PAGES) {
    console.log('DONE: no more pages.');
    clearInterval(timer);
    return;
  }

  // --- получаем данные страницы ---
  const res = await fetchUserCodeChallenges(USER_NAME, currentPage);
  if (!res.success) {
    console.error('Error loading page:', currentPage, res.error);
    currentPage++;
    return;
  }

  const challenges = res.data.data;

  // --- выбираем диапазон (0–50, 50–100...) ---
  const chunk = challenges.slice(start, end);
  console.log(`Slice from ${start} to ${end}, total: ${chunk.length}`);

  // --- записываем каждый challenge ---
  for (const { id } of chunk) {
    const task = await fetchCodeChallenge(id);

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

  // --- двигаем диапазон ---
  start += STEPS;
  end += STEPS;

  if (end > MAX_CHALLENGES) {
    // начинаем снова
    start = 0;
    end = STEPS;

    // переходим на следующую page
    currentPage++;
  }
}

processPage();

const timer = setInterval(processPage, INTERVAL);
