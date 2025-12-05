'use strict';

const MAX_PAGES = 21;
const MAX_CHALLENGES = 200;
const STEPS = 50;
const INTERVALE = 900_000; // 15 min

let count = 0;

const fn = () => {
  let start = 0;
  let end = STEPS;

  console.log(count);
  if (MAX_PAGES < count) {
    clearInterval(timer);
    return;
  }
  for(let steps = 0; steps <= 150; steps += STEPS) {
    console.dir({ start, end });
    end += STEPS;
    start += STEPS;
  }
  count++;
}

let timer = setInterval(fn, 2); 



