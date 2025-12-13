'use strict';

import { unwrapApiResult } from '#helpers';
import { SaveAuthoredResponse } from '#contracts';

export const saveAuthoredChallengesSafeSync = async (
  db,
  userId,
  { username },
  {
    fetchUserAuthored,
    fetchCodeChallenge,
    insertAuthoredChallengeSync,
    insertChallengeSync,
    selectAllChallengeIds,
  }
) => {
  const { ok, data, error } = unwrapApiResult(await fetchUserAuthored(username));

  if (!ok) {
    return SaveAuthoredResponse.fail(null, error);
  }

  const { data: challenges } = data;
  const { ids: existingIds } = selectAllChallengeIds(db);

  let savedCount = 0;
  const errors = [];

  for (const { id } of challenges) {
    if (!id) continue;

    if (!existingIds.has(id)) {
      const challengeRes = unwrapApiResult(await fetchCodeChallenge(id));
      if (!challengeRes.ok) {
        errors.push({ id, error: challengeRes.error });
        continue;
      }
      insertChallengeSync(db, challengeRes.data);
      existingIds.add(id);
    }

    insertAuthoredChallengeSync(db, userId, id);
    savedCount++;
  }

  return SaveAuthoredResponse.ok(data, savedCount, challenges.length, errors.length ? errors : null);
};
