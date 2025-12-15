'use strict';

export const pLimit = (limit) => {
  let activeCount = 0;
  const queue = [];

  const next = () => {
    if (activeCount >= limit || queue.length === 0) return;

    const { fn, resolve, reject } = queue.shift();
    activeCount++;

    fn()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        activeCount--;
        next();
      });
  };

  return (fn) =>
    new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
};

