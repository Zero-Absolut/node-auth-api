import { Op } from "sequelize";
import { UserSessions } from "../models/user.js";

export const cleanupExpiredSessions = async () => {
  try {
    const deletedSessions = await UserSessions.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date(),
        },
      },
    });

    console.log(
      `[SESSION CLEANUP] ${deletedSessions} sessão(ões) expiradas removidas.`,
    );
  } catch (err) {
    console.error("[SESSION CLEANUP] Erro ao limpar sessões expiradas:", err);
  }
};
