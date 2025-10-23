import { generateSha256Hash } from "./generateSha256Hash.js";

const assert = (desc, cond) => {
  if (cond) console.log(`✅ ${desc}`);
  else console.error(`❌ ${desc}`);
};

const hash1 = generateSha256Hash("test");
const hash2 = generateSha256Hash("test");
assert("same input produces same hash", hash1 === hash2);
assert("different input produces different hash", hash1 !== generateSha256Hash("test1"));

