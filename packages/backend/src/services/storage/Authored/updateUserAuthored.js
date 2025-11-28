import { prepareSection } from '#storage';
import { generateCryptoHash } from '#hash';
import { CodewarsAPI } from '#api';

const { getAuthoredChallenges } = CodewarsAPI;

export const updateUserAuthored = async ({ user, state, load }) => {
  const { Authored } = state;

  const {
    data: { delta },
    hash: { deltaHash },
  } = Authored;

  await prepareSection(Authored, {
    user,
    cacheName: 'userAuthored.hash.json',
    dataName: 'userAuthored.json',
    load,
  });

  const newData = await getAuthoredChallenges(user);

  const newFullHash = generateCryptoHash(newData.data);
  const oldFullHash = Authored.oldCache.fullHash;

  if (newFullHash === oldFullHash) return state;

  state.change = true;
  state.authoredChange = true;
  Authored.change = true;
  deltaHash.fullHash = newFullHash;

  const katas = newData.data.data;

  katas.forEach((kata) => {
    const { id } = kata;

    const newHash = generateCryptoHash(id);
    const oldHash = Authored.oldCache[id];

    if (newHash === oldHash) return;

    if (oldHash === undefined) {
      delta[id] = { action: 'insert', data: kata };
    } else {
      delta[id] = { action: 'update', data: kata };
    }

    deltaHash[id] = newHash;
  });

  const oldKatas = Authored.oldData;
  const ids = katas.map((kata) => kata.id);

  for (const id in oldKatas) {
    if (ids.includes(id)) continue;

    delete oldKatas[id];
    delta[id] = { action: 'delete' };
  }

  return state;
};
