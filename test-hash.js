import { getProfile } from "./api/codewarsAPI.js";
import { hasChanged } from "./services/hash/index.js";
import { USER_NAME, USER_FIELDS } from "./config.js";
import { savePosition, loadPosition } from "./services/hash/storage.js";

// Функция для получения профиля
const fetchUserProfile = async (userNameOrId) => {
  const response = await fetch(getProfile(userNameOrId));
  const data = await response.json();
  return data;
};

const profileData = await fetchUserProfile(USER_NAME);

if (hasChanged(`user-${USER_NAME}`, profileData, USER_FIELDS)) {
  console.log("Профиль изменился! Сохраняем данные и обновляем DB...");
} else {
  console.log("Изменений нет.");
}

const oldPosition = loadPosition(); 
const newPosition = profileData.leaderboardPosition;

if (oldPosition !== newPosition) {
  console.log(
    `Leaderboard position обновилась: ${oldPosition} → ${newPosition}`
  );
  savePosition(newPosition);
} else {
  console.log("Leaderboard position не изменилась.");
}
