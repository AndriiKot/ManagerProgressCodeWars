import { USER_NAME } from '#config';
import { CodewarsAPI } from '#api';
import { userProfileSchema, validateWithRankCheck } from '#schemas';
import { Storage } from '#storage';
import { sqlite } from '#db';

const { bootstrapDatabase } = sqlite;

(async () => {
  const { getUserProfile } = CodewarsAPI;

  const db = bootstrapDatabase();

  const { success: isProfileSuccess, data: profileData } = await getUserProfile(USER_NAME);

  if (!isProfileSuccess) {
    console.warn(`Failed to fetch profile for ${USER_NAME}`);
    return;
  }

  const validationResult = validateWithRankCheck({
    schema: userProfileSchema,
    data: profileData,
    options: { recursive: true, strict: true },
  });

  if (validationResult.isValid) {
    console.log(`User profile ${USER_NAME} data is valid!`);

  } else {
    console.warn(`User profile ${USER_NAME} failed validation`, validationResult.errors);
  }
})();
