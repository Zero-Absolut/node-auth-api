import bcrypt from "bcrypt";

export const createPasswordHash = async (password) => {
  if (!password) return null;

  const hash = await bcrypt.hash(password, 10);

  return hash;
};
