import { createUser } from "../service/authService.js";
import { errorMap } from "../utils/errorMap.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const result = await createUser({ name, email, password });

    if (!result.success) {
      if (result.code === "USER_ALREADY_EXISTS") {
        return res.status(409).json({
          success: result.success,
          message: result.message,
          code: result.code,
        });
      }

      if (result.code === "DATABASE_ACCESS_ERROR") {
        return res.status(500).json({
          success: result.success,
          message: result.message,
          code: result.code,
        });
      }

      return res.status(500).json(result);
    }
    return res.status(201).json(result);
  } catch (err) {
    console.error("Erro ao inserir novo usuário", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      code: "INTERNAL_ERROR",
    });
  }
}

export const resend = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "E-mail obrigatório",
        code: "VALIDATION_ERROR",
      });
    }

    const result = await resendMail(email);

    if (!result.success) {
      const status = errorMap[result.code] || 500;

      return res.status(status).json({
        success: result.success,
        message: result.message,
        code: result.code,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      code: result.code,
    });
  } catch (err) {
    console.error("Erro ao processar a requisição", err);

    return res.status(500).json({
      success: false,
      message: "Erro ao processar requisição.",
      code: "INTERNAL_ERROR",
    });
  }
};
