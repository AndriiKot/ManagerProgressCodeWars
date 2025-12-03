import { serializeValidJSON } from './serialize/index.js';
import { generateSha256Hash } from './generateSha256Hash.js';

export const generateCryptoHash = (data) => {
  const serialized = serializeValidJSON(data);
  return generateSha256Hash(serialized);
};
