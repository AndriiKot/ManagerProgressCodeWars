'use strict';

import { DatabaseSync } from 'node:sqlite';
import { buildGlobalCache } from './buildGlobalCache.js';

// Тест функции buildGlobalCache
async function runTest() {
  const db = new DatabaseSync(':memory:');

  try {
    // === Создаем таблицу challenges ===
    db.exec(`
      CREATE TABLE challenges (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);

    // === Вставляем несколько челленджей ===
    db.exec(`
      INSERT INTO challenges (id, name) VALUES
      ('id1', 'Challenge 1'),
      ('id2', 'Challenge 2');
    `);

    // === Вызываем buildGlobalCache ===
    const cache = await buildGlobalCache(db);

    console.log('Fetched cache:', cache);

    // === Проверяем структуру объекта ===
    const hasUsers = 'users' in cache && typeof cache.users === 'object' && cache.users !== null;
    const hasChallenges = 'challenges' in cache && cache.challenges instanceof Set;

    if (hasUsers && hasChallenges) {
      console.log('✅ buildGlobalCache returns correct structure');
    } else {
      console.error('❌ buildGlobalCache structure is incorrect');
      if (!hasUsers) console.error('Missing or invalid "users" field');
      if (!hasChallenges) console.error('Missing or invalid "challenges" field');
    }

    // === Проверка содержимого challenges Set ===
    const expectedIds = ['id1', 'id2'];
    const allFound = expectedIds.every(id => cache.challenges.has(id));
    if (allFound && cache.challenges.size === expectedIds.length) {
      console.log('✅ challenges Set contains correct IDs');
    } else {
      console.error('❌ challenges Set content is incorrect', [...cache.challenges]);
    }

  } finally {
    db.close();
    console.log('✅ Database connection closed');
  }
}

runTest();
