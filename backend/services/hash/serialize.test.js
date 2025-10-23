import { serialize } from "./serialize.js";

const assert = (desc, cond) => {
  if (cond) console.log(`✅ ${desc}`);
  else console.error(`❌ ${desc}`);
};

assert("serialize: string", serialize("hello") === JSON.stringify({ __type: "string", value: "hello" }));
assert("serialize: number", serialize(42) === JSON.stringify({ __type: "number", value: 42 }));
assert("serialize: boolean", serialize(true) === JSON.stringify({ __type: "boolean", value: true }));
assert("serialize: null", serialize(null) === JSON.stringify({ __type: "object", value: null }));
assert("serialize: array", serialize([1,2,3]) === JSON.stringify([1,2,3]));
assert("serialize: object keys sorted", serialize({ b: 2, a: 1 }) === JSON.stringify({ a: 1, b: 2 }));

