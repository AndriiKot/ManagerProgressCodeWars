'use strict';

import { unwrapApiResult } from '#helpers';
import { SaveCompletedResponse } from '#contracts';

export const saveCompletedChallengesSafeSync = async (
  db,
  userId,
  { username },
  {
    getUserCompleted,
    getCodeChallenge,
    insertChallengeSync,
    insertCompletedChallengeSync,
    selectAllChallengeIds,
  },
) => {
  const { ok, data, error } = unwrapApiResult(
    await getUserCompleted(username),
  );

  if (!ok) {
    return SaveCompletedResponse.fail(null, error);
  }

  const { data: challenges } = data;
  const { ids: existingIds } = selectAllChallengeIds(db);

  let savedCount = 0;
  const errors = [];

  for (const challenge of challenges) {
    const { id } = challenge;
    if (!id) continue;

    if (!existingIds.has(id)) {
      const challengeRes = unwrapApiResult(
        await getCodeChallenge(id),
      );

      if (!challengeRes.ok) {
        errors.push({ id, error: challengeRes.error });
        continue;
      }

      insertChallengeSync(db, challengeRes.data);
      existingIds.add(id);
    }

    insertCompletedChallengeSync(db, userId, challenge);
    savedCount++;
  }

  return SaveCompletedResponse.ok(
    data,
    savedCount,
    challenges.length,
    errors.length ? errors : null,
  );
};

