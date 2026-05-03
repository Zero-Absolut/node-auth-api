import bcrypt from "bcrypt";

export const createHash = async (value) => {
  try {
    if (!value) return null;

    return await bcrypt.hash(value, 10);

    
  } catch (err) {
    console.error("Erro no processamento", err);

    return;
  }
};
