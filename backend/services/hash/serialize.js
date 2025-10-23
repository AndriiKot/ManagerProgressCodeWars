export const serialize = (raw) => {
  if (Array.isArray(raw)) return JSON.stringify(raw);
  if (typeof raw === "object" && raw !== null)
    return JSON.stringify(raw, Object.keys(raw).sort());
  return JSON.stringify({ __type: typeof raw, value: raw });
};

