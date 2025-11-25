'use strict';

export const validateApiResource = async ({
  apiFn,
  apiArgs = [],
  schema,
  validateFn = null,   
  options = { strict: true, recursive: true },
}) => {
  const result = await apiFn(...apiArgs);

  if (!result.success) {
    return {
      ...result,
      isValid: false,
      validationErrors: ["API request failed"],
    };
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
    return {
      ...result,
      isValid: false,
      validationErrors: validation.errors,
    };
  }

  return {
    ...result,
    isValid: true,
    validationErrors: null,
  };
};
