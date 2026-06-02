import { User, PasswordHistories, UserSessions } from "../models/user.js";

export const meService = async (id) => {
  try {
    const user = await User.findByPk(id, {
      attributes: [
        "id",
        "name",
        "email",
        "provider",
        "isActive",
        "isBlocked",
        "createdAt",
      ],
    });

    if (!user) {
      return {
        success: false,
        message: "Usuário não encontrado.",
        code: "USER_NOT_FOUND",
      };
    }

    const passwordHistories = await PasswordHistories.findAll({
      where: {
        userId: user.id,
      },

      attributes: ["id", "createdAt"],

      order: [["createdAt", "DESC"]],
    });

    const totalPasswordChanges = passwordHistories.length;

    const activeSessions = await UserSessions.count({
      where: {
        isActive: true,
      },
    });

    const data = {
      user: user,
      passwords: passwordHistories,
      passords: totalPasswordChanges,
    };

    return {
      success: true,
      message: "Dados carregados.",
      code: "DASHBOARD_LOADED",
      data: data,
    };
    //pagina dash onde terminar de buscar dados dela
  } catch (err) {
    console.error("Erro ao acessar base de dados.", err);

    return {
      success: false,
      message: "Erro ao acessar base de dados.",
      code: "DATABASE_ACCESS_ERROR",
    };
  }
};
