import crypto from "node:crypto";

export const generateSha256Hash = (str) => {
  const hash = crypto.createHash("sha256");
  hash.update(str, "utf8");
  return hash.digest("hex");
};

