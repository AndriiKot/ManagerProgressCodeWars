import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('./database-test.sqlite');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();

console.log('Tables in DB:', tables);

