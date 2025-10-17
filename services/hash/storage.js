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
