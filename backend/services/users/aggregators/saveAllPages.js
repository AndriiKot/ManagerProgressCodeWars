'use strict';

export const saveAllPages = async (db, userId, user, services) => {
  const { saveCompletedChallengesSafeSync } = services;

  let totalSaved = 0;
  const allErrors = [];
  const existingIds = services.selectAllChallengeIds(db) || new Set();

  const firstRes = await saveCompletedChallengesSafeSync(
    db,
    userId,
    user,
    services,
    0,
    existingIds
  );

  if (!firstRes.success) {
    return {
      totalSaved,
      allErrors: firstRes.errors ? [firstRes.errors] : [],
    };
  }

  totalSaved += firstRes.savedCount;
  if (firstRes.errors) allErrors.push(...firstRes.errors);

  const { totalPages } = firstRes.data;

  for (let page = 1; page < totalPages; page++) {
    const res = await saveCompletedChallengesSafeSync(
      db,
      userId,
      user,
      services,
      page,
      existingIds
    );

    if (!res.success) {
      if (res.errors) allErrors.push(res.errors);
      continue;
    }

    totalSaved += res.savedCount;
    if (res.errors) allErrors.push(...res.errors);
  }

  return {
    totalSaved,
    allErrors,
  };
};
