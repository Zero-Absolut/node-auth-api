import { validateSessionService } from "../services/sessionService.js";
import { errorMap } from "../utils/errorMap.js";

export const requireAuth = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Não autorizado.",
        code: "UNAUTHORIZED",
      });
    }

    const validate_session = await validateSessionService(req.sessionID);

    const status = errorMap[validate_session.code] || 500;

    if (!validate_session.success) {
      return res.status(status).json(validate_session);
    }

    next();
  } catch (err) {
    console.error("Erro ao validar autenticação.", err);

    return res.status(500).json({
      success: false,
      message: "Erro interno do sistema.",
      code: "INTERNAL_ERROR",
    });
  }
};
