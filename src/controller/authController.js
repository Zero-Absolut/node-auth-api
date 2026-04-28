import { createUser } from "../service/authService.js";

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
