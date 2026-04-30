import bcrypt from "bcrypt";

export const createHash = async (value) => {
  try {
    if (!value) return null;

    const hash = await bcrypt.hash(value, 10);

    return hash;
  } catch (err) {
    console.error("Erro no processamento", err);

    return;
  }
};
