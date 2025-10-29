export const getValueByPath = (obj, path) => {
  if (!path) return obj; 
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};
