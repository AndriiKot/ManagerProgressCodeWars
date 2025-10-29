import { USER_NAME } from '#config';    
import { CodewarsAPI } from '#api';
import { userProfileSchema, validateWithRankCheck } from "#schemas";


(async () => {
  const { getUserProfile } = CodewarsAPI;

  const { success: isProfileSuccess, data: profileData } = await getUserProfile(USER_NAME);

  if (isProfileSuccess) {
    const validationResult = validateWithRankCheck(userProfileSchema, profileData, {
      recursive: true,
      strict: true,
    });

    if (validationResult.isValid) {
      console.log(`user profile ${USER_NAME} data is valid!`);
    }
  }
})();
