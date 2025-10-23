import { generateCryptoHash } from "./generateCryptoHash.js";

const assert = (desc, cond) => {
  if (cond) console.log(`✅ ${desc}`);
  else console.error(`❌ ${desc}`);
};

const obj1 = { a: 1, b: 2 };
const obj2 = { b: 2, a: 1 };
assert("object key order does not affect hash", generateCryptoHash(obj1) === generateCryptoHash(obj2));

const arr = [1,2,3];
assert("array hash is string", typeof generateCryptoHash(arr) === "string");

