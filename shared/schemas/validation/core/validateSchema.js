export function validateSchema(schema, data, options = {}) {
  const {
    recursive = true,
    strict = false,
    customValidators = [],
  } = options;

  const errors = [];

  function validateObject(objSchema, objData, path = '') {
    // Проверка типа корневого объекта
    if (objSchema.type && !checkType(objData, objSchema.type)) {
      errors.push({
        path: path || 'root',
        message: getTypeErrorMessage(objSchema.type, objData)
      });
      return;
    }

    // Проверка обязательных полей
    if (objSchema.required && Array.isArray(objSchema.required)) {
      for (const field of objSchema.required) {
        if (!(field in objData)) {
          errors.push({
            path: path ? `${path}.${field}` : field,
            message: `Required field '${field}' is missing`
          });
        }
      }
    }

    if (!objData || typeof objData !== 'object') return;

    const validatedKeys = new Set();

    // 1. Проверка определенных в схеме свойств
    if (objSchema.properties) {
      for (const [key, propSchema] of Object.entries(objSchema.properties)) {
        validatedKeys.add(key);
        const currentPath = path ? `${path}.${key}` : key;
        
        if (key in objData) {
          const value = objData[key];

          // Проверка типа значения
          if (propSchema.type && !checkType(value, propSchema.type)) {
            errors.push({
              path: currentPath,
              message: getTypeErrorMessage(propSchema.type, value)
            });
            continue;
          }

          // Проверка enum для строк
          if (propSchema.enum && propSchema.type === 'string' && !propSchema.enum.includes(value)) {
            errors.push({
              path: currentPath,
              message: `Value '${value}' is not one of: ${propSchema.enum.join(', ')}`
            });
            continue;
          }

          // Дополнительные проверки для чисел
          if (propSchema.type === 'number' || propSchema.type === 'integer') {
            const numberErrors = validateNumber(value, propSchema, currentPath);
            errors.push(...numberErrors);
          }

          // Рекурсивная проверка вложенных объектов
          if (recursive && propSchema.type === 'object') {
            validateObject(propSchema, value, currentPath);
          }
          
          // Проверка массива
          if (recursive && propSchema.type === 'array' && propSchema.items) {
            validateArray(propSchema, value, currentPath);
          }
        } else if (propSchema.required) {
          errors.push({
            path: currentPath,
            message: `Required field '${key}' is missing`
          });
        }
      }
    }

    // 2. Проверка additionalProperties (динамических полей)
    if (objSchema.additionalProperties && typeof objSchema.additionalProperties === 'object') {
      for (const key of Object.keys(objData)) {
        if (!validatedKeys.has(key)) {
          validatedKeys.add(key);
          const currentPath = path ? `${path}.${key}` : key;
          const value = objData[key];
          const additionalSchema = objSchema.additionalProperties;
          
          // Проверка типа динамического поля
          if (additionalSchema.type && !checkType(value, additionalSchema.type)) {
            errors.push({
              path: currentPath,
              message: getTypeErrorMessage(additionalSchema.type, value)
            });
            continue;
          }

          // Проверка enum для additionalProperties
          if (additionalSchema.enum && additionalSchema.type === 'string' && !additionalSchema.enum.includes(value)) {
            errors.push({
              path: currentPath,
              message: `Value '${value}' is not one of: ${additionalSchema.enum.join(', ')}`
            });
            continue;
          }

          // Дополнительные проверки для чисел
          if (additionalSchema.type === 'number' || additionalSchema.type === 'integer') {
            const numberErrors = validateNumber(value, additionalSchema, currentPath);
            errors.push(...numberErrors);
          }

          // Рекурсивная проверка динамических объектов
          if (recursive && additionalSchema.type === 'object') {
            validateObject(additionalSchema, value, currentPath);
          }
        }
      }
    }

    // 3. Strict проверка
    if (strict && !objSchema.additionalProperties) {
      for (const key of Object.keys(objData)) {
        if (!validatedKeys.has(key)) {
          errors.push({
            path: path ? `${path}.${key}` : key,
            message: `Unexpected field '${key}'`
          });
        }
      }
    }
  }

  function validateArray(arrSchema, arrData, path) {
    if (!Array.isArray(arrData)) {
      errors.push({
        path,
        message: `Expected array, got '${typeof arrData}'`
      });
      return;
    }

    for (let i = 0; i < arrData.length; i++) {
      const elementPath = `${path}[${i}]`;
      const element = arrData[i];
      
      if (arrSchema.items.type === 'object' && recursive) {
        validateObject(arrSchema.items, element, elementPath);
      } else {
        if (!checkType(element, arrSchema.items.type)) {
          errors.push({
            path: elementPath,
            message: getTypeErrorMessage(arrSchema.items.type, element)
          });
        }
        
        if (arrSchema.items.type === 'number' || arrSchema.items.type === 'integer') {
          const numberErrors = validateNumber(element, arrSchema.items, elementPath);
          errors.push(...numberErrors);
        }
      }
    }
  }

  // Вспомогательные функции
  function checkType(value, expectedType) {
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
  }

  function getTypeErrorMessage(expectedType, value) {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    
    switch (expectedType) {
      case 'integer':
        return `Expected integer, got ${actualType}${Number.isInteger(value) ? '' : ' (not integer)'}`;
      default:
        return `Expected type '${expectedType}', got '${actualType}'`;
    }
  }

  function validateNumber(value, schema, path) {
    const numberErrors = [];

    if (schema.negative && value >= 0) {
      numberErrors.push({
        path,
        message: `Expected negative number, got ${value}`
      });
    }

    if (schema.positive && value <= 0) {
      numberErrors.push({
        path,
        message: `Expected positive number, got ${value}`
      });
    }

    if (schema.minimum !== undefined && value < schema.minimum) {
      numberErrors.push({
        path,
        message: `Value ${value} is less than minimum ${schema.minimum}`
      });
    }

    if (schema.maximum !== undefined && value > schema.maximum) {
      numberErrors.push({
        path,
        message: `Value ${value} is greater than maximum ${schema.maximum}`
      });
    }

    return numberErrors;
  }

  validateObject(schema, data);
  return { isValid: errors.length === 0, errors };
}