'use strict';

import { DatabaseSync } from 'node:sqlite';
import { buildGlobalCache } from './buildGlobalCache.js';

async function runTest() {
  const db = new DatabaseSync(':memory:');

  try {
    // ===== CREATE TABLES =====
    db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        codewars_id TEXT
      );
      CREATE TABLE challenges (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);

    // ===== INSERT TEST DATA =====
    db.exec(`
      INSERT INTO users (username, codewars_id) VALUES
      ('Alice', 'u1'),
      ('Bob', 'u2');
      INSERT INTO challenges (id, name) VALUES
      ('c1', 'Challenge 1'),
      ('c2', 'Challenge 2');
    `);

    // ===== RUN buildGlobalCache =====
    const cache = await buildGlobalCache(db);

    console.log('Fetched cache:', cache);

    // ===== ASSERTIONS =====
    if (
      cache.usersSlug instanceof Set &&
      cache.usersIds instanceof Set &&
      typeof cache.users === 'object' &&
      cache.challenges instanceof Set
    ) {
      console.log('✅ buildGlobalCache returns correct structure');
    } else {
      console.error('❌ buildGlobalCache structure is incorrect');
    }

    // Проверка содержимого
    const expectedUsers = ['Alice', 'Bob'];
    const expectedIds = ['u1', 'u2'];
    const expectedChallenges = ['c1', 'c2'];

    const usersOk =
      expectedUsers.every(u => cache.usersSlug.has(u)) &&
      expectedIds.every(id => cache.usersIds.has(id));

    const challengesOk =
      expectedChallenges.every(c => cache.challenges.has(c)) &&
      cache.challenges.size === expectedChallenges.length;

    if (usersOk && challengesOk) {
      console.log('✅ Users and challenges are correct');
    } else {
      console.error('❌ Users or challenges are incorrect');
    }

  } finally {
    db.close();
    console.log('✅ Database connection closed');
  }
}

runTest();
