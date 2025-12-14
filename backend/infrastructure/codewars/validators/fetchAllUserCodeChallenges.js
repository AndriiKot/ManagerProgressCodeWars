'use strict';

import { fetchUserCodeChallenges } from '#api';

export const fetchAllUserCodeChallenges = async (username) => {
  const firstPage = await fetchUserCodeChallenges(username, 0);

  if (!firstPage.success) {
    console.error('Failed to fetch first page', firstPage.error);
    return firstPage;
  }

  const {
    data: { totalPages },
  } = firstPage;

  const pagesIndexes = Array.from({ length: totalPages - 1 }, (_, i) => i + 1);

  const pages = await Promise.all(
    pagesIndexes.map((page) => fetchUserCodeChallenges(username, page))
  );

  return [firstPage, ...pages];
};
