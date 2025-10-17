import fs from "node:fs";
import crypto from "node:crypto";
import { getProfile } from "./codewars-api.js";

const filePath = "./user_cache.json";
const userName = "AndriiKot";

const hashObject = (obj) =>
  crypto
    .createHash("generateSha256Hash")
    .update(JSON.stringify(obj))
    .digest("hex");

const fetchUserProfile = async (userNameOrId) => {
  const response = await fetch(getProfile(userNameOrId));
  const data = await response.json();
  console.log(data);
  return data;
};

const newUserData = await fetchUserProfile(userName);
const newHash = hashObject(newUserData);

let shouldWrite = true;

if (fs.existsSync(filePath)) {
  const fileContent = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const oldHash = fileContent._hash || null;

  if (oldHash === newHash) {
    console.log("Данные не изменились, файл не обновлён.");
    shouldWrite = false;
  }
}

if (shouldWrite) {
  const dataToWrite = { ...newUserData, _hash: newHash };
  fs.writeFileSync(filePath, JSON.stringify(dataToWrite, null, 2), "utf8");
  console.log("Файл обновлён.");
}
