import { User } from "../models/user.js";

export const googleLoginService = async (googleData) => {
  try {
    const { googleId, email, name } = googleData;

    const user = await User.findOne({
      where: { email },
      attributes: [
        "id",
        "name",
        "email",
        "provider",
        "googleId",
        "isActive",
        "isBlocked",
      ],
    });

    // Usuário não existe
    if (!user) {
      return await User.create({
        name,
        email,
        googleId,
        provider: "google",
        isActive: true,
      });
    }

    // Validações
    if (user.isBlocked) {
      throw new Error("USER_BLOCKED");
    }

    if (!user.isActive) {
      throw new Error("ACCOUNT_NOT_ACTIVE");
    }

    // Usuário já utiliza Google
    if (user.provider === "google") {
      return user;
    }

    // Usuário local vinculando Google
    if (user.provider === "local") {
      user.googleId = googleId;

      await user.save();

      return user;
    }

    return user;
  } catch (err) {
    console.error("Erro ao acessar base de dados.", err);

    throw err;
  }
};
