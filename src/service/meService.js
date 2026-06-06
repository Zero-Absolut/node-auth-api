import {
  User,
  PasswordHistories,
  UserSessions,
  UserLogs,
} from "../models/user.js";
import { UAParser } from "ua-parser-js";

export const meService = async (id, userAgent) => {
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
        "googleId",
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

    const activeSessionsUser = await UserSessions.findOne({
      where: {
        userId: user.id,
        isActive: true,
      },
    });
    const logs = await UserLogs.findAll({
      where: {
        userId: user.id,
      },
      attributes: ["id", "action", "description", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit: 20,
    });
    const parser = new UAParser(userAgent);

    const browserName = parser.getBrowser().name || "Desconhecido";
    const osName = parser.getOS().name || "Desconhecido";

    const deviceInfo = `${browserName} - ${osName}`;
    console.log("passwordHistories", passwordHistories);
    console.log("logs", logs);
    const data = {
      user,
      passwords: passwordHistories,
      passwordsChange: totalPasswordChanges,
      activeSessions,
      activeSessionsUser,
      browser: deviceInfo,
      logs,
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
