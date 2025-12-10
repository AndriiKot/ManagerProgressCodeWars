'use strict';

export const withTimeout = async(promiseFn, ms, retries = 1) => {
  let timer;
  try {
    return await Promise.race([
      promiseFn(),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('Timeout')), ms);
      }),
    ]);
  } catch (err) {
    if (retries > 0) {
      console.warn('Retrying after failure:', err.message);
      return withTimeout(promiseFn, ms, retries - 1);
    }
    throw err;
  } finally {
    clearTimeout(timer); 
  }
}

