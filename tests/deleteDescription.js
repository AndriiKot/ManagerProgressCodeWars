import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { pLimit } from '#utils';

const PATH = './Challenges';
const limit = pLimit(50); 

const files = await readdir(PATH, { withFileTypes: true });
const fileNames = files.filter(f => f.isFile()).map(f => f.name);

const promises = fileNames.map(fileName =>
  limit(async () => {
    const filePath = join(PATH, fileName);
    try {
      const data = await readFile(filePath, 'utf-8');
      const obj = JSON.parse(data);
      delete obj.description;
      await writeFile(filePath, JSON.stringify(obj, null, 2), 'utf-8');
      return fileName;
    } catch (error) {
      console.error(`Ошибка в ${fileName}:`, error.message);
      return null;
    }
  })
);

const results = await Promise.allSettled(promises);
console.log(`Обработано ${results.filter(r => r.status === 'fulfilled').length} из ${fileNames.length} файлов`);
