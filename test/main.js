import fs from "fs/promises";

const BASE_URL = "https://www.codewars.com/api/v1/users";
const USERNAME = "Krillan"; // 🔹 твой Codewars username

async function fetchCompletedPage(username, page = 0) {
  const url = `${BASE_URL}/${username}/code-challenges/completed?page=${page}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Ошибка при загрузке страницы ${page}: ${res.status}`);
  }

  const data = await res.json();
  return { page, data: data.data };
}

async function fetchAllCompletedKatas(username) {
  console.log("🔹 Загружаем первую страницу...");
  const firstPage = await fetchCompletedPage(username, 0);
  const totalPages = firstPage.data.length
    ? (await fetch(`${BASE_URL}/${username}/code-challenges/completed?page=0`).then(r => r.json())).totalPages
    : 1;

  console.log(`📄 Всего страниц: ${totalPages}`);

  // Создаём массив промисов для всех остальных страниц (1 ... totalPages-1)
  const pagePromises = [];
  for (let page = 1; page < totalPages; page++) {
    pagePromises.push(fetchCompletedPage(username, page));
  }

  // Ждём все запросы одновременно
  const results = await Promise.allSettled(pagePromises);

  // Собираем успешные ответы
  const successful = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  // Объединяем первую страницу + все остальные
  const allKatas = [firstPage, ...successful]
    .sort((a, b) => a.page - b.page) // сортируем по номеру страницы
    .flatMap((p) => p.data);

  console.log(`\n🎯 Всего загружено ката: ${allKatas.length}`);
  return allKatas;
}

async function main() {
  try {
    const allKatas = await fetchAllCompletedKatas(USERNAME);

    await fs.writeFile(
      "completed_katas.json",
      JSON.stringify(allKatas, null, 2),
      "utf8"
    );

    console.log("💾 Файл completed_katas.json успешно сохранён!");
  } catch (err) {
    console.error("❌ Ошибка:", err.message);
  }
}

main();

