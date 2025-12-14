'use strict';

import { ApiResponse } from '#contracts';

export const retryFetchValidation = async ({
  fn,                 
  args = [],          
  validate,           
  retries = 3,
  delayMs = 0,
  context = '',
}) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const result = await fn(...args);

    if (!result.success) {
      return result;
    }

    if (!validate || validate(result)) {
      return result;
    }

    console.warn(
      `[Validation retry] ${context} attempt ${attempt}/${retries}`,
    );

    if (attempt < retries && delayMs > 0) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  return ApiResponse.fail(
    context || 'validation',
    'Validation failed after retries',
  );
};

