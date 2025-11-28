import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Указываем конкретный файл, а не папку
export const SHARED = pathToFileURL(join(__dirname, '../../shared/index.js')).href;
