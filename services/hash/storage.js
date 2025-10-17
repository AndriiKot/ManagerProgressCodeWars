import fs from 'node:fs';
import path from 'node:path';

const CACHE_DIR = './cache/codewars';

export const saveHash = (name, hash) => {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(path.join(CACHE_DIR, `${name}.hash.json`), JSON.stringify({ hash }), 'utf8');
};

export const loadHash = (name) => {
  const filePath = path.join(CACHE_DIR, `${name}.hash.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8')).hash;
};

