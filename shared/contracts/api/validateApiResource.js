'use strict';

import { deepFreeze } from '#utils';

const contract = ({ success, url = null, data = null, error = null, isValid = true, validationErrors = null }) => {
  return deepFreeze({ success, url, data, error, isValid, validationErrors });
};

export const validateApiResource = async ({
  apiFn,
  apiArgs = [],
  schema,
  validateFn = null,
  options = { strict: true, recursive: true },
}) => {
  const result = await apiFn(...apiArgs);

  if (!result.success) {
    return contract({
      ...result,
      isValid: false,
      validationErrors: ['API request failed'],
    });
  }

  let validation;
  if (validateFn) {
    validation = validateFn({ data: result.data, schema, options });
  } else {
    validation = {
      isValid: true,
      errors: null,
    };
  }

  if (!validation.isValid) {
    return contract({
      ...result,
      isValid: false,
      validationErrors: validation.errors,
    });
  }

  return contract({
    ...result,
    isValid: true,
    validationErrors: null,
  });
};
