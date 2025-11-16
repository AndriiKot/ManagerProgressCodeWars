import { prepareSection } from '#storage';
import { generateCryptoHash } from '#hash';
import { CodewarsAPI } from '#api';

const { getAllPagesCompletedChallenges } = CodewarsAPI;

export const updateUserCodeChallenges = async ({ user, state, load }) => {
  const { CodeChallenges } = state;

  const {
    data: { delta },
    hash: { deltaHash },
  } = CodeChallenges;

  await prepareSection(CodeChallenges, {
    user,
    cacheName: 'code-challenges/code-challenges.hash.json',
    dataName: 'code-challenges/pages/',
    load,
  });

  const pages = await getAllPagesCompletedChallenges(user);

  const newFullHash = generateCryptoHash(pages);
  const oldFullHash = CodeChallenges.oldCache.fullHash;

  if (newFullHash === oldFullHash) return state;

  state.change = true;
  CodeChallenges.change = true;
  deltaHash.fullHash = newFullHash;

  pages.forEach((page, index) => {
    const newHash = generateCryptoHash(page);
    const oldHash = CodeChallenges.oldCache[index];

    if (newHash === oldHash) return;

    deltaHash[index] = newHash;
    delta[index] = page;
  });

  const oldPages = CodeChallenges.oldData;
  const indices = pages.map((_, i) => i.toString());

  for (const key in oldPages) {
    if (!indices.includes(key)) {
      delete oldPages[key];
      delta[key] = { action: 'delete' };
    }
  }

  return state;
};

