'use strict';

import fs from 'node:fs';
import path from 'node:path';

import { USER_NAME } from '#config';
import { runLimited } from '#shared-utils';
import {
  fetchUserProfile,
  fetchUserCodeChallenges,
  fetchUserAuthored,
  fetchCodeChallenge,
} from '#codewars';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const LOG_FILE = path.resolve('errors.log');

// -------------------------------
// ЛОГИРОВАНИЕ ОШИБОК В ФАЙЛ
// -------------------------------
function logErrorToFile(error, meta = {}) {
  const entry = {
    time: new Date().toISOString(),
    meta,
    message: error?.message || String(error),
    stack: error?.stack || null,
  };

  fs.appendFileSync(LOG_FILE, JSON.stringify(entry, null, 2) + '\n', 'utf8');
}

// -------------------------------
// 🟦 УНИВЕРСАЛЬНАЯ ОБВЁРТКА ДЛЯ ЛЮБОГО API
// fn — функция API (fetchUserCodeChallenges / fetchCodeChallenge / др.)
// args — аргументы к функции
// -------------------------------
function fetchWithDelay(fn, ...args) {
  return async () => {
    try {
      const res = await fn(...args);
      await delay(500);        // задержка после каждого запроса
      return res;
    } catch (err) {
      logErrorToFile(err, { fn: fn.name, args });
      throw err;
    }
  };
}

// -------------------------------
// 1) Узнаём количество страниц
// -------------------------------
const {
  data: { totalPages: count },
} = await fetchUserCodeChallenges(USER_NAME, 0);

// массив страниц
const pageNumbers = Array.from({ length: count }, (_, i) => i);

// -------------------------------
// 2) Загружаем все страницы с кодварс
// -------------------------------
const pagesData = await runLimited(
  5, // ← ограничение по параллелизму
  pageNumbers,
  (page) => fetchWithDelay(fetchUserCodeChallenges, USER_NAME, page)()
);

// -------------------------------
// 3) Собираем все ID katas
// -------------------------------
const ids = pagesData.flatMap((page) =>
  page?.data?.data?.map((ch) => ch.id) ?? []
);

console.log(`Всего kata ids: ${ids.length}`);

// -------------------------------
// 4) Загружаем данные по КАЖДОМУ kata
// -------------------------------
const challengesData = await runLimited(
  5,
  ids,
  (id) => fetchWithDelay(fetchCodeChallenge, id)()
);

// лог для проверки
console.log('Загружено хинтов:', challengesData.length);


/*
async function backoffFetch(fn, args, attempt = 1) {
  try {
    return await fn(...args);
  } catch (e) {
    if (e.status === 429) {
      const wait = Math.min(60_000 * attempt, 10 * 60_000); // до 10 минут
      console.log(`429 → ждем ${wait/1000} сек`);
      await delay(wait);
      return backoffFetch(fn, args, attempt + 1);
    }
    throw e;
  }
}
*/
