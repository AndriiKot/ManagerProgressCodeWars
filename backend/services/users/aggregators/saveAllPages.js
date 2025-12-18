'use strict';

const saveAllPages = async (db, userId, user, services) => {
  const allErrors = [];
  let totalSaved = 0;

  const firstPageRes = await saveCompletedChallengesSafeSync(
    db,
    userId,
    user,
    services
  );

  if (!firstPageRes.ok) {
    return { totalSaved, allErrors: firstPageRes.errors || [] };
  }

  totalSaved += firstPageRes.savedCount;
  if (firstPageRes.errors) allErrors.push(...firstPageRes.errors);

  const { totalPages } = firstPageRes.data;

  for (let page = 1; page < totalPages; page++) {
    const pageRes = await saveCompletedChallengesSafeSync(
      db,
      userId,
      user,
      {
        ...services,
        getUserCompleted: (username) => services.getUserCompleted(username, page),
      }
    );

    if (!pageRes.ok) continue;

    totalSaved += pageRes.savedCount;
    if (pageRes.errors) allErrors.push(...pageRes.errors);
  }

  return { totalSaved, allErrors };
};

