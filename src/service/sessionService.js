import { UserSessions } from "../models/user.js";

export const saveSessionService = async (data_session) => {
  try {
    const { sessionId, userId, ipAddress, userAgent } = data_session;

    const newSession = await UserSessions.create({
      sessionId: sessionId,
      userId: userId,
      ipAddress: ipAddress,
      userAgent: userAgent,

      isActive: true,

      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    return newSession;
  } catch (err) {
    console.error("Erro ao acessar base de dados", err);
    throw err;
  }
};

export const validateSessionService = async (sessionId) => {
  try {
    const valid_session = await UserSessions.findOne({
      where: {
        sessionId,
        isActive: true,
      },
    });

    if (!valid_session) {
      return {
        success: false,
        message: "Sessão inativa",
        code: "SESSION_INACTIVE",
      };
    }

    if (valid_session.expiresAt < new Date()) {
      valid_session.isActive = false;
      await valid_session.save();

      return {
        success: false,
        message: "Sessão expirada.",
        code: "SESSION_EXPIRED",
      };
    }

    return {
      success: true,
      message: "Sessão ativa.",
      code: "SESSION_ACTIVE",
    };
  } catch (err) {
    console.error("Erro ao acessar base de dados", err);

    throw err;
  }
};

export const deactivateSession = async (sessionID) => {
  try {
    const session = await UserSessions.findOne({
      where: {
        sessionId: sessionID,
      },
    });

    if (!session) {
      return false;
    }

    session.isActive = false;
    await session.save();

    return;
  } catch (err) {
    console.error("Erro ao acessar base de dados.", err);

    throw err;
  }
};
