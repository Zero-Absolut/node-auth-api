import { saveSessionService } from "../service/sessionService.js";

export const googleCallbackController = async (req, res) => {
  try {
    req.session.user = req.user;

    const data = {
      sessionId: req.sessionID,
      userId: req.session.user.id,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    };

    await saveSessionService(data);

    return res.redirect("http://127.0.0.1:5500/pages/auth-success.html");
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Erro interno do sistema.",
      code: "INTERNAL_ERROR",
    });
  }
};
