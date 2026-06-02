import { errorMap } from "../utils/errorMap.js";
import { meService } from "../service/meService.js";

export const meController = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado.",
        code: "UNAUTHORIZED",
      });
    }

    const result = await meService(req.session.user.id);

    console.log(result.dataValues);

    console.log(result.passwords);

    const status = errorMap[result.code];

    return res.status(status).json(result);
  } catch (err) {
    console.error("Erro interno.", err);

    return res.status(500).json({
      success: false,
      message: "Erro interno.",
      code: "INTERNAL_ERROR",
    });
  }
};
