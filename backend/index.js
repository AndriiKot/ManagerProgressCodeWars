import { getUserProfileDiff } from "./getUserProfileDiff.js";
import { applyUserProfileUpdates } from "./applyUserProfileUpdates.js";
import { USER_NAME } from "./config.js";

(async () => {
  console.log("🔍 Checking user profile updates...");
  const updates = await getUserProfileDiff();
  console.log("📦 Update check result:", updates);

  await applyUserProfileUpdates(USER_NAME, updates);
})();
