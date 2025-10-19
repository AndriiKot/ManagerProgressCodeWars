export const logger = {
  info: (msg) => console.log(`ℹ️ ${msg}`),
  action: (msg) => console.log(`⚙️ ${msg}`),
  saveHash: (field) => console.log(`💾 Сохраняю "${field}" в хэш...`),
  saveDB: (field) => console.log(`🗄️ Сохраняю "${field}" в базу данных...`),
  apiCall: (url) => console.log(`🌐 Делаю запрос к API: ${url}`),
  start: (username) => console.log(`\n=== Обработка изменений для пользователя ${username} ===`),
  end: () => console.log("=== Обработка завершена ===\n"),
};

