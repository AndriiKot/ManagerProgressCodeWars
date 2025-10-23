export const logger = {
  info: (msg) => console.log(`ℹ️ ${msg}`),
  action: (msg) => console.log(`⚙️ ${msg}`),
  saveHash: (field) => console.log(`💾 Saving "${field}" to hash...`),
  saveDB: (field) => console.log(`🗄️ Saving "${field}" to database...`),
  apiCall: (url) => console.log(`🌐 Making API call: ${url}`),
  start: (username) =>
    console.log(`\n=== Processing updates for user ${username} ===`),
  end: () => console.log("=== Processing complete ===\n"),
};
