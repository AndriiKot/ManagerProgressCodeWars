import fs from "node:fs";
import path from "node:path";
import { USER_CACHE_DIR, USER_NAME } from "../../config.js";

export const saveHash = (userName, hash) => {
  if (!fs.existsSync(USER_CACHE_DIR)) {
    fs.mkdirSync(USER_CACHE_DIR, { recursive: true });
  }
  const filePath = path.join(USER_CACHE_DIR, `${userName}.hash.json`);
  fs.writeFileSync(filePath, JSON.stringify({ hash }), "utf8");
};

export const loadHash = (userName) => {
  const filePath = path.join(USER_CACHE_DIR, `${userName}.hash.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")).hash;
};

const positionFile = path.join(
  USER_CACHE_DIR,
  `user-position-${USER_NAME}.json`
);

export const savePosition = (position) => {
  if (!fs.existsSync(USER_CACHE_DIR)) {
    fs.mkdirSync(USER_CACHE_DIR, { recursive: true });
  }
  fs.writeFileSync(
    positionFile,
    JSON.stringify({ leaderboardPosition: position }),
    "utf8"
  );
};

export const loadPosition = () => {
  if (!fs.existsSync(positionFile)) return null;
  return JSON.parse(fs.readFileSync(positionFile, "utf8")).leaderboardPosition;
};

export const saveAuthoredKatas = (katas) => {
  if (!fs.existsSync(USER_CACHE_DIR)) {
    fs.mkdirSync(USER_CACHE_DIR, { recursive: true });
  }
  fs.writeFileSync(
    path.join(USER_CACHE_DIR, `user-authored-katas-${USER_NAME}.json`),
    JSON.stringify({ totalAuthored: katas }),
    "utf8"
  );
};

export const loadAuthoredKatas = () => {
  const filePath = path.join(
    USER_CACHE_DIR,
    `user-authored-katas-${USER_NAME}.json`
  );
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")).totalAuthored;
};

export const saveHonor = (honor) => {
  if (!fs.existsSync(USER_CACHE_DIR)) {
    fs.mkdirSync(USER_CACHE_DIR, { recursive: true });
  }
  fs.writeFileSync(
    path.join(USER_CACHE_DIR, `user-honor-${USER_NAME}.json`),
    JSON.stringify({ honor }),
    "utf8"
  );
};

export const loadHonor = () => {
  const filePath = path.join(USER_CACHE_DIR, `user-honor-${USER_NAME}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")).honor;
};

export const saveTotalUniquesKatas = (katas) => {
  if (!fs.existsSync(USER_CACHE_DIR)) {
    fs.mkdirSync(USER_CACHE_DIR, { recursive: true });
  }

  fs.writeFileSync(
    path.join(USER_CACHE_DIR, `user-uniques-katas-${USER_NAME}.json`),
    JSON.stringify({ totalCompleted: katas }),
    "utf8"
  );
};
export const loadTotalUniquesKatas = () => {
  const filePath = path.join(
    USER_CACHE_DIR,
    `user-uniques-katas-${USER_NAME}.json`
  );
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")).totalCompleted;
};
