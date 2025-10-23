import { serialize } from "./serialize.js";
import { generateSha256Hash } from "./generateSha256Hash.js";

export const generateCryptoHash = (data) => {
  const serialized = serialize(data);
  return generateSha256Hash(serialized);
};

