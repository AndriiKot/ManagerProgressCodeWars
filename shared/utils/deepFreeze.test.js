import { deepFreeze } from "./deepFreeze.js";

const testObj = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3
    }
  },
  f: [1, 2, { g: 4 }]
};

deepFreeze(testObj);

try {
  testObj.a = 10;
} catch (err) {
  console.log(err.message);
}

try {
  testObj.b.c = 20;
} catch (err) {
  console.log(err.message);
}

try {
  testObj.b.d.e = 30;
} catch (err) {
  console.log(err.message);
}

try {
  testObj.f[2].g = 40;
} catch (err) {
  console.log(err.message);
}

console.log(JSON.stringify(testObj, null, 2));

