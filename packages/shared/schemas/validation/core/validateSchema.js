export const validateSchema = ({ schema, data, options = {} }) => {
  const { recursive = true, strict = false, customValidators = [] } = options;

  const errors = [];

  const checkTypeMulti = (value, expected) => {
    if (Array.isArray(expected)) {
      return expected.some((type) => checkType(value, type));
    }
    return checkType(value, expected);
  };

  const checkType = (value, expectedType) => {
    switch (expectedType) {
      case 'integer':
        return Number.isInteger(value);
      case 'number':
        return typeof value === 'number';
      case 'string':
        return typeof value === 'string';
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'null':
        return value === null;
      default:
        return typeof value === expectedType;
    }
  };

  const getTypeErrorMessage = (expectedType, value) => {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    const expectedStr = Array.isArray(expectedType) ? expectedType.join(', ') : expectedType;

    return expectedStr === 'integer'
      ? `Expected integer, got ${actualType}${Number.isInteger(value) ? '' : ' (not integer)'}`
      : `Expected type '${expectedStr}', got '${actualType}'`;
  };

  const validateNumber = (value, schema, path) => {
    const numberErrors = [];

    if (schema.negative && value >= 0) {
      numberErrors.push({ path, message: `Expected negative number, got ${value}` });
    }

    if (schema.positive && value <= 0) {
      numberErrors.push({ path, message: `Expected positive number, got ${value}` });
    }

    if (schema.minimum !== undefined && value < schema.minimum) {
      numberErrors.push({ path, message: `Value ${value} is less than minimum ${schema.minimum}` });
    }

    if (schema.maximum !== undefined && value > schema.maximum) {
      numberErrors.push({ path, message: `Value ${value} is greater than maximum ${schema.maximum}` });
    }

    return numberErrors;
  };

  const validateFormat = (value, format, path) => {
    if (format === 'date-time') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        errors.push({
          path,
          message: `Value '${value}' is not a valid ISO 8601 date-time`,
        });
      }
    }
  };

  const validateArray = (arrSchema, arrData, path) => {
    if (!Array.isArray(arrData)) {
      errors.push({ path, message: `Expected array, got '${typeof arrData}'` });
      return;
    }

    arrData.forEach((element, i) => {
      const elementPath = `${path}[${i}]`;

      if (arrSchema.items.type === 'object' && recursive) {
        validateObject(arrSchema.items, element, elementPath);
      } else {
        if (!checkTypeMulti(element, arrSchema.items.type)) {
          errors.push({ path: elementPath, message: getTypeErrorMessage(arrSchema.items.type, element) });
        }

        if (arrSchema.items.format) {
          validateFormat(element, arrSchema.items.format, elementPath);
        }

        if (['number', 'integer'].includes(arrSchema.items.type) ||
            (Array.isArray(arrSchema.items.type) && arrSchema.items.type.some(t => ['number', 'integer'].includes(t)))) {
          const numberErrors = validateNumber(element, arrSchema.items, elementPath);
          errors.push(...numberErrors);
        }
      }
    });
  };

  const validateObject = (objSchema, objData, path = '') => {
    if (objSchema.type && !checkTypeMulti(objData, objSchema.type)) {
      errors.push({ path: path || 'root', message: getTypeErrorMessage(objSchema.type, objData) });
      return;
    }

    if (objSchema.required && Array.isArray(objSchema.required)) {
      for (const field of objSchema.required) {
        if (!(field in objData)) {
          errors.push({ path: path ? `${path}.${field}` : field, message: `Required field '${field}' is missing` });
        }
      }
    }

    if (!objData || typeof objData !== 'object') return;

    const validatedKeys = new Set();

    if (objSchema.properties) {
      for (const [key, propSchema] of Object.entries(objSchema.properties)) {
        validatedKeys.add(key);
        const currentPath = path ? `${path}.${key}` : key;

        if (key in objData) {
          const value = objData[key];

          if (propSchema.type && !checkTypeMulti(value, propSchema.type)) {
            errors.push({ path: currentPath, message: getTypeErrorMessage(propSchema.type, value) });
            continue;
          }

          if (propSchema.format) {
            validateFormat(value, propSchema.format, currentPath);
          }

          if (propSchema.enum && propSchema.type === 'string' && !propSchema.enum.includes(value)) {
            errors.push({ path: currentPath, message: `Value '${value}' is not one of: ${propSchema.enum.join(', ')}` });
            continue;
          }

          if (['number', 'integer'].includes(propSchema.type) ||
              (Array.isArray(propSchema.type) && propSchema.type.some(t => ['number', 'integer'].includes(t)))) {
            const numberErrors = validateNumber(value, propSchema, currentPath);
            errors.push(...numberErrors);
          }

          if (recursive && propSchema.type === 'object') {
            validateObject(propSchema, value, currentPath);
          }

          if (recursive && propSchema.type === 'array' && propSchema.items) {
            validateArray(propSchema, value, currentPath);
          }
        } else if (propSchema.required) {
          errors.push({ path: currentPath, message: `Required field '${key}' is missing` });
        }
      }
    }

    if (objSchema.additionalProperties && typeof objSchema.additionalProperties === 'object') {
      for (const key of Object.keys(objData)) {
        if (!validatedKeys.has(key)) {
          validatedKeys.add(key);
          const currentPath = path ? `${path}.${key}` : key;
          const value = objData[key];
          const additionalSchema = objSchema.additionalProperties;

          if (additionalSchema.type && !checkTypeMulti(value, additionalSchema.type)) {
            errors.push({ path: currentPath, message: getTypeErrorMessage(additionalSchema.type, value) });
            continue;
          }

          if (additionalSchema.format) {
            validateFormat(value, additionalSchema.format, currentPath);
          }

          if (additionalSchema.enum && additionalSchema.type === 'string' && !additionalSchema.enum.includes(value)) {
            errors.push({ path: currentPath, message: `Value '${value}' is not one of: ${additionalSchema.enum.join(', ')}` });
            continue;
          }

          if (['number', 'integer'].includes(additionalSchema.type) ||
              (Array.isArray(additionalSchema.type) && additionalSchema.type.some(t => ['number', 'integer'].includes(t)))) {
            const numberErrors = validateNumber(value, additionalSchema, currentPath);
            errors.push(...numberErrors);
          }

          if (recursive && additionalSchema.type === 'object') {
            validateObject(additionalSchema, value, currentPath);
          }
        }
      }
    }

    if (strict && !objSchema.additionalProperties) {
      for (const key of Object.keys(objData)) {
        if (!validatedKeys.has(key)) {
          errors.push({ path: path ? `${path}.${key}` : key, message: `Unexpected field '${key}'` });
        }
      }
    }
  };

  if (schema.type === 'array') {
    validateArray(schema, data, 'root');
  } else {
    validateObject(schema, data);
  }

  return { isValid: errors.length === 0, errors };
};
