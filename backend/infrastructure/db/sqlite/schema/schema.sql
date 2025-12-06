-- Включаем поддержку внешних ключей
PRAGMA foreign_keys = ON;

-- ===========================
-- Таблицы Users
-- ===========================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    name TEXT,
    honor INTEGER DEFAULT 0,
    clan TEXT,
    leaderboard_position INTEGER,
    total_completed INTEGER DEFAULT 0,
    total_authored INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    codewars_id TEXT UNIQUE
);

-- ===========================
-- Таблица рангов
-- ===========================
CREATE TABLE IF NOT EXISTS ranks (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    color TEXT NOT NULL
);

-- Предзаполняем базовые ранги Codewars
INSERT OR IGNORE INTO ranks (id, name, color) VALUES
(-8, '8 kyu', 'white'), (-7, '7 kyu', 'white'), (-6, '6 kyu', 'yellow'),
(-5, '5 kyu', 'yellow'), (-4, '4 kyu', 'blue'), (-3, '3 kyu', 'blue'),
(-2, '2 kyu', 'yellow'), (-1, '1 kyu', 'yellow'), 
(1, '1 dan', 'green'), (2, '2 dan', 'green'),
(0, 'unknown', 'gray');

-- ===========================
-- Таблица user_skills
-- ===========================
CREATE TABLE IF NOT EXISTS user_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill)
);

-- ===========================
-- Таблица user_ranks
-- ===========================
CREATE TABLE IF NOT EXISTS user_ranks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scope TEXT NOT NULL CHECK(scope IN ('overall', 'language')),
    language TEXT,
    rank_id INTEGER NOT NULL REFERENCES ranks(id),
    score INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, scope, language),

    CHECK (
        (scope = 'overall' AND language = '') OR
        (scope = 'language' AND language <> '')
    )
);

-- ===========================
-- Таблица глобальных счетчиков
-- ===========================
CREATE TABLE IF NOT EXISTS counts (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    total_challenges INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Вставляем единственную строку
INSERT INTO counts (id, total_challenges)
VALUES (1, 0)
ON CONFLICT(id) DO NOTHING;

-- ===========================
-- Таблица челленджей
-- ===========================
CREATE TABLE IF NOT EXISTS challenges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    category TEXT,
    rank_id INTEGER DEFAULT 0,
    created_by_username TEXT,
    approved_by_username TEXT,
    total_attempts INTEGER DEFAULT 0,
    total_completed INTEGER DEFAULT 0,
    total_stars INTEGER DEFAULT 0,
    vote_score INTEGER DEFAULT 0,
    published_at TEXT,
    approved_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(rank_id) REFERENCES ranks(id)
);

-- ===========================
-- Триггеры обновления глобального счётчика челленджей
-- ===========================
CREATE TRIGGER IF NOT EXISTS trg_challenges_insert
AFTER INSERT ON challenges
BEGIN
    UPDATE counts
    SET total_challenges = total_challenges + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS trg_challenges_delete
AFTER DELETE ON challenges
BEGIN
    UPDATE counts
    SET total_challenges = total_challenges - 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = 1;
END;

-- ===========================
-- Таблица challenge_tags
-- ===========================
CREATE TABLE IF NOT EXISTS challenge_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(challenge_id, tag)
);

-- ===========================
-- Таблица challenge_languages
-- ===========================
CREATE TABLE IF NOT EXISTS challenge_languages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(challenge_id, language)
);

-- ===========================
-- Таблица completed_challenges
-- ===========================
CREATE TABLE IF NOT EXISTS completed_challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    completed_at TEXT NOT NULL,
    languages_json TEXT CHECK (json_valid(languages_json) OR languages_json IS NULL),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, challenge_id) ON CONFLICT REPLACE
);

CREATE TABLE IF NOT EXISTS completed_challenge_languages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    completed_challenge_id INTEGER NOT NULL REFERENCES completed_challenges(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    UNIQUE(completed_challenge_id, language)
);

-- ===========================
-- Таблица authored_challenges
-- ===========================
CREATE TABLE IF NOT EXISTS authored_challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, challenge_id)
);

-- ===========================
-- Индексы
-- ===========================
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ranks_user_scope ON user_ranks(user_id, scope);
CREATE INDEX IF NOT EXISTS idx_user_ranks_language ON user_ranks(language) WHERE language IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_completed_challenges_user_date ON completed_challenges(user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_completed_challenges_challenge_id ON completed_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_authored_challenges_user_id ON authored_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_rank_id ON challenges(rank_id);
CREATE INDEX IF NOT EXISTS idx_challenges_category ON challenges(category);
CREATE INDEX IF NOT EXISTS idx_challenges_slug ON challenges(slug);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
