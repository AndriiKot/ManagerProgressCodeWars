import { USER_NAME } from '#config';
import { CodewarsAPI } from '#api';
import { userProfileSchema, validateWithRankCheck } from '#schemas';
import { Storage } from '#storage';
import { initDatabase } from '#db';

(async () => {
  const { getUserProfile } = CodewarsAPI;
  const db = await initDatabase();
  const { success: isProfileSuccess, data: profileData } = await getUserProfile(
    USER_NAME,
  );

  if (isProfileSuccess) {
    const validationResult = validateWithRankCheck({
      schema: userProfileSchema,
      data: profileData,
      options: {
        recursive: true,
        strict: true,
      },
    });

    if (validationResult.isValid) {
      console.log(`user profile ${USER_NAME} data is valid!`);
     // await Storage.update({ user: USER_NAME, data: profileData });
    }
  }
})();
