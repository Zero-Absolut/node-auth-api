import { validateSessionService } from "../services/sessionService.js";

export const requireAuth = async (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Não autorizado.",
      code: "UNAUTHORIZED",
    });
  }

  const validate_session = await validateSessionService(req.sessionID);

  if (!validate_session.success) {
    return res.status(401).json({
      success: false,
      message: "Não autorizado.",
      code: "UNAUTHORIZED",
    });
  }

  next();
};
