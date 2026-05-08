import crypto from "crypto";
export const twoFactorCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};
