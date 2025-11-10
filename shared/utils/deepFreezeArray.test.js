import { deepFreezeArray } from './deepFreezeArray.js';
import { deepFreeze } from './deepFreeze.js';

const testArr = [1, { a: 2, b: { c: 3 } }, [4, 5, { d: 6 }]];

deepFreezeArray(testArr);

try {
  testArr[0] = 99;
} catch (err) {
  console.log(err.message);
}

try {
  testArr[1].a = 22;
} catch (err) {
  console.log(err.message);
}

try {
  testArr[1].b.c = 33;
} catch (err) {
  console.log(err.message);
}

try {
  testArr[2][2].d = 66;
} catch (err) {
  console.log(err.message);
}

console.log(JSON.stringify(testArr, null, 2));
