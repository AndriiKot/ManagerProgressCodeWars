function validateSchema(schema, data, options = {}) {
  const {
    recursive = true,    // флаг рекурсивной проверки
    strict = false       // флаг строгой проверки (только поля из схемы)
  } = options;

  const errors = [];

  function validateObject(objSchema, objData, path = '') {
    // Проверка типа
    if (objSchema.type && typeof objData !== objSchema.type) {
      errors.push({
        path: path || 'root',
        message: `Expected type '${objSchema.type}', got '${typeof objData}'`
      });
      return; // Прерываем если тип не совпадает
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

    // Проверка свойств объекта
    if (objSchema.properties && typeof objData === 'object' && objData !== null) {
      for (const [key, propSchema] of Object.entries(objSchema.properties)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (key in objData) {
          const value = objData[key];

          // Проверка простых типов
          if (propSchema.type && typeof value !== propSchema.type) {
            errors.push({
              path: currentPath,
              message: `Expected type '${propSchema.type}' for '${key}', got '${typeof value}'`
            });
            continue; // Переходим к следующему полю
          }

          // Рекурсивная проверка вложенных объектов
          if (recursive && propSchema.type === 'object' && propSchema.properties) {
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

      // Строгая проверка - только поля из схемы
      if (strict) {
        for (const key of Object.keys(objData)) {
          if (!objSchema.properties || !(key in objSchema.properties)) {
            errors.push({
              path: path ? `${path}.${key}` : key,
              message: `Unexpected field '${key}'`
            });
          }
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

    // Проверка каждого элемента массива
    for (let i = 0; i < arrData.length; i++) {
      const elementPath = `${path}[${i}]`;
      const element = arrData[i];
      
      if (arrSchema.items.type === 'object' && recursive && arrSchema.items.properties) {
        validateObject(arrSchema.items, element, elementPath);
      } else if (typeof element !== arrSchema.items.type) {
        errors.push({
          path: elementPath,
          message: `Expected array element type '${arrSchema.items.type}', got '${typeof element}'`
        });
      }
    }
  }

  // Запуск валидации
  validateObject(schema, data);

  return {
    isValid: errors.length === 0,
    errors
  };
}
