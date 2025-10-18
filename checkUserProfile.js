import { getProfile } from "./api/codewarsAPI.js";
import { hasChanged } from "./services/hash/index.js";
import { USER_NAME, USER_FIELDS_RANKS } from "./config.js";
import {
  savePosition,
  loadPosition,
  loadAuthoredKatas,
  saveAuthoredKatas,
  saveHonor,
  loadHonor,
  saveTotalUniquesKatas,
  loadTotalUniquesKatas,
} from "./services/hash/storage.js";

/**
 * Проверяет обновления профиля и позиции пользователя
 * @returns {Promise<{newData: boolean, newPosition: boolean}>}
 */
export const checkUserProfileUpdates = async () => {
  const profileData = await fetch(getProfile(USER_NAME)).then((res) =>
    res.json()
  );

  const newRanks = hasChanged(
    `user-ranks-${USER_NAME}`,
    profileData,
    USER_FIELDS_RANKS
  );

  const newPosition = loadPosition() !== profileData.leaderboardPosition;
  const newAuthoredKatas =
    loadAuthoredKatas() !== profileData.codeChallenges.totalAuthored;
  const newHonor = loadHonor() !== profileData.honor;
  const newUniquesKatas =
    loadTotalUniquesKatas() !== profileData.codeChallenges.totalCompleted;

  if (newRanks)
    console.log("Профиль изменился! Сохраняем данные и обновляем DB...");
  else console.log("Изменений нет.");

  if (newPosition) {
    console.log(
      `Leaderboard position обновилась: ${loadPosition()} → ${
        profileData.leaderboardPosition
      }`
    );
    savePosition(profileData.leaderboardPosition);
  } else console.log("Leaderboard position не изменилась.");

  if (newAuthoredKatas) {
    console.log(
      `Total authored katas обновилось: ${loadAuthoredKatas()} → ${
        profileData.codeChallenges.totalAuthored
      }`
    );
    saveAuthoredKatas(profileData.codeChallenges.totalAuthored);
  } else console.log("Total authored katas не изменилось.");

  if (newHonor) {
    console.log(`Honor обновился: ${loadHonor()} → ${profileData.honor}`);
    saveHonor(profileData.honor);
  } else console.log("Honor не изменился.");

  if (newUniquesKatas) {
    console.log(
      `Total uniques katas обновилось: ${loadTotalUniquesKatas()} → ${
        profileData.codeChallenges.totalCompleted
      }`
    );
    saveTotalUniquesKatas(profileData.codeChallenges.totalCompleted);
  } else console.log("Total uniques katas не изменилось.");

  console.log({
    newRanks,
    newPosition,
    newAuthoredKatas,
    newHonor,
    newUniquesKatas,
  });
  return { newRanks, newPosition, newAuthoredKatas, newHonor, newUniquesKatas };
};

checkUserProfileUpdates();
