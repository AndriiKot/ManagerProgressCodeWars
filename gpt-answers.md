Отлично — распишу подробно, что должна содержать каждая папка/файл и как всё связывается. Буду давать примеры кода и формат данных там, где это полезно. Поехали! 🚀

# Общая идея

Проект — npm-пакет/утилита, которая:

* раз в указанное время (GitHub Actions) опрашивает Codewars,
* сравнивает хеш профиля,
* при изменениях сохраняет данные в SQLite,
* создаёт папки/`README.md` для новых ката,
* при необходимости парсит собственные решения через Puppeteer,
* коммитит и пушит изменения в GitHub.

Ниже — детальная структура и объяснения.

---

# Дерево проекта (расширённо)

```
/src/
  api/
    codewarsApi.js
  services/
    hash/
      index.js
      storage.js
    database/
      index.js
      migrations.sql
      queries.js
    puppeteer/
      index.js
      auth.js
      fetchSolution.js
    github/
      index.js
      git.js
  utils/
    logger.js
    config.js
    fileHelpers.js
  workers/
    syncWorker.js
  index.js

/cache/
  codewars/
    <username>.hash.json

/data/
  codewars/
    katas/
      <kata-slug>/
        README.md
        solution.js   (опционально)

tests/
  unit/
  integration/

/.github/
  workflows/
    sync.yml

.gitignore
package.json
README.md
```

---

# Папка `/src/` — исходники

## `/src/api/codewarsApi.js`

Отвечает только за работу с внешним API Codewars (fetch-обёртки).

* Экспортирует функции: `getUser(username)`, `getKata(idOrSlug)`, `getCompletedChallenges(username, page?)` и т.д.
* Не содержит бизнес-логики и не парсит ответов глубоко — возвращает JSON.

Пример:

```js
export const getUser = async (username) => {
  const res = await fetch(`https://www.codewars.com/api/v1/users/${username}`);
  if (!res.ok) throw new Error('Codewars API error');
  return res.json();
};

export const getKata = async (idOrSlug) => {
  const res = await fetch(`https://www.codewars.com/api/v1/code-challenges/${idOrSlug}`);
  if (!res.ok) throw new Error('Codewars API error');
  return res.json();
};
```

---

## `/src/services/hash/`

Логика создания и хранения хеша профиля.

* `index.js` — фасад: `computeHash(data)` и `hasChanged(username, newHash)` (сравнивает с сохранённым).
* `storage.js` — методы чтения/записи файлов в `/cache/codewars/`.

Формат файла кеша: `cache/codewars/<username>.hash.json`

```json
{
  "hash": "196d9...",
  "lastChecked": "2025-10-17T08:00:00Z",
  "profileSnapshot": { /* опционально: краткая выборка полей */ }
}
```

Примечание: Хеш генерируется через `crypto.createHash('sha256').update(serialized).digest('hex')`, где `serialized` — заранее упорядоченная и отфильтрованная часть ответа (например: `username|honor|ranks.overall.score|codeChallenges.totalCompleted`), чтобы изменения только в неважных полях не ломали систему.

---

## `/src/services/database/`

Работа с SQLite.

* `index.js` — инициализация DB (создание файла, подключение).
* `migrations.sql` — DDL: таблицы `users`, `katas`, `changes`, `solutions`.
* `queries.js` — подготовленные SQL-запросы (insert/update/select).

Пример миграций:

```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT,
  honor INTEGER,
  overall_score INTEGER,
  last_checked TEXT
);

CREATE TABLE IF NOT EXISTS changes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  change_type TEXT,
  payload TEXT, -- json
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS katas (
  id TEXT PRIMARY KEY,
  slug TEXT,
  name TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  readme_path TEXT
);

CREATE TABLE IF NOT EXISTS solutions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kata_id TEXT,
  user_id TEXT,
  code TEXT,
  language TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

---

## `/src/services/puppeteer/`

Парсинг страниц Codewars от имени пользователя.

* `auth.js` — функция логина (использует логин и пароль/ключ из секрета).
* `fetchSolution.js` — открывает страницу ката и извлекает код решения пользователя.
* `index.js` — контролирует процесс (retry, headless режим, rate-limit).

ВАЖНО по безопасности: хранить данные для логина **нельзя в репозитории** — использовать GitHub Actions Secrets. Также подумать о 2FA и возможных блокировках от Codewars при автоматическом логине (нужен throttle, delays).

---

## `/src/services/github/`

Интеграция с git/GitHub — создание коммитов, push, возможное создание PR.

* `git.js` — функции: `commitAndPush(folder, message)`. Может использовать `simple-git` или shell `git`.
* `index.js` — обёртки для GitHub Actions: например, установка user.email/name, работа с token (GITHUB_TOKEN).

---

## `/src/utils/`

Утилиты:

* `logger.js` — логирование (winston или простая консоль-обёртка).
* `config.js` — централизованные настройки (пути к папкам, env-переменные, частота).
* `fileHelpers.js` — создание папок, запись README шаблона.

---

## `/src/workers/syncWorker.js`

Главная бизнес-логика, запускаемая GitHub Action:

1. Получает username(s) из `config`.
2. Запрашивает профиль через `api/getUser`.
3. Вычисляет новый хеш через `services/hash`.
4. Если хеш поменялся:

   * сохраняет snapshot в DB,
   * для новых ката вызывает `getKata` и `puppeteer` (опционально),
   * создаёт папку `data/codewars/katas/<slug>/` + `README.md`,
   * коммитит изменения и пушит.
5. Логирует результат.

---

## `/src/index.js`

Экспорт публичного API пакета (если это npm-пакет). Например:

```js
export { default as sync } from './workers/syncWorker.js';
export * from './src/services/hash';
```

Также можно предоставить CLI-обёртку (`bin/` в package.json) — чтобы запускать локально.

---

# Папка `/cache/`

Хранит только служебные файлы/хеши. Пример:

```
/cache/codewars/AndriiKot.hash.json
```

Этот кеш исключается из git (`.gitignore`), т.к. генерируем.

---

# Папка `/data/`

Тут живут сгенерированные артефакты — `katas/<slug>/README.md` и опционально `solution.js`.

Пример `README.md` шаблона:

```md
# Multiply

**Rank:** 4 kyu  
**Language:** JavaScript

## Description
(текст из Codewars API)

## My solution
Файл: `solution.js`

## Stats
- Added: 2025-10-17
- Source: https://www.codewars.com/kata/<slug>
```

---

# `/tests/`

Юнит/интеграционные тесты:

* Тесты для `codewarsApi` мокают fetch.
* Тесты для `hash` проверяют детерминированность хеша.
* Интеграционные тесты с sqlite в памяти (`:memory:`).

---

# `/ .github/workflows/sync.yml` — пример (важно!)

Ниже — сокращённый пример workflow: (не забудь положить секреты: `CODEWARS_USERNAME`, `CODEWARS_PASSWORD` (если нужен), `GITHUB_TOKEN` — обычно автоматически доступен).

```yaml
name: sync-codewars

on:
  schedule:
    - cron: '0 8 * * *' # раз в день в 08:00 UTC — адаптируй под часовой пояс
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run sync
        env:
          CODEWARS_USERNAME: ${{ secrets.CODEWARS_USERNAME }}
          CODEWARS_PASSWORD: ${{ secrets.CODEWARS_PASSWORD }} # если нужен
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          node --no-warnings ./dist/index.js # или npm run sync
      - name: Commit & push changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add -A
          git commit -m "sync: update from Codewars" || echo "no changes to commit"
          git push
```

> Примечание: вместо хранения пароля рекомендуется использовать OAuth/токен или авторизацию через GitHub Actions с сохранёнными сессиями. Если автоматический логин через Puppeteer невозможен (2FA), подумай об альтернативе — парсить только общедоступные страницы.

---

# Важные практические советы

### 1) Безопасность и секреты

* Никогда не пушь пароли и приватные ключи. Используй GitHub Secrets.
* Puppeteer логин — хрупкое место: возможен блок от Codewars. Используй throttling и делай редкие обращения.

### 2) `.gitignore`

Пример:

```
/node_modules
/cache
/data
.env
/*.db
```

### 3) Формат кеша/хеша

* Хеш должен быть детерминированным: сортировать ключи и выбирать только значимые поля.
* Хеш хранить в `/cache/codewars/<username>.hash.json`.

### 4) DB vs filesystem

* SQLite — для истории и запросов.
* Файловая система `/data` — для человечески читаемых артефактов (README, решения).
* Используй пути в DB (например, `readme_path`) для связи.

### 5) Версии и тестирование

* Пиши unit-tests для: генерации хеша, обработки ответов API, шаблона README.
* CI: `npm test` в workflow.

### 6) Логирование и наблюдаемость

* Включи уровни логов (info/warn/error). В Actions будет видно вывод.

### 7) Конфиг

* Хранить конфиг в `src/utils/config.js` и позволить переопределять через env:

  * `CACHE_DIR`, `DATA_DIR`, `SYNC_CRON`, `USERNAMES` и т.д.

---

# Примеры файлов (коротко)

`package.json` — скрипты:

```json
{
  "scripts": {
    "build": "babel src -d dist",
    "start": "node dist/index.js",
    "sync": "node dist/workers/syncWorker.js",
    "test": "ava"
  },
  "dependencies": {
    "node-fetch": "^3",
    "sqlite3": "^5",
    "puppeteer": "^21",
    "simple-git": "^3"
  }
}
```

`src/utils/config.js`:

```js
export const CACHE_DIR = process.env.CACHE_DIR || './cache/codewars';
export const DATA_DIR = process.env.DATA_DIR || './data/codewars';
export const USERS = (process.env.USERS || 'AndriiKot').split(',');
```

---

Если хочешь, могу:

* Сгенерировать `migrations.sql` полностью;
* Написать `services/hash/index.js` и `storage.js`;
* Подготовить `syncWorker.js` (готовый рабочий код) и пример GitHub Actions workflow с полной конфигурацией секретов.

Что из этого сделать первым — выбирай, и я прямо сейчас напишу код.

