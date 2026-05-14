import session from "express-session";
import {
  createUser,
  loginUser,
  resendMail,
  userActivateAccount,
  validateTwoFactorCode,
  valideResendTwoFactorCode,
} from "../service/authService.js";
import { errorMap } from "../utils/errorMap.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const result = await createUser({ name, email, password });

    const status = errorMap[result.code] || 500;

    if (!result.success) {
      return res.status(status).json({
        success: false,
        message: result.message,
        code: result.code,
      });
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

export const activateAccount = async (req, res) => {
  try {
    const token = req.query.token;

    const result = await userActivateAccount(token);

    const status = errorMap[result.code] || 500;

    if (!result.success) {
      return res.status(status).json({
        success: result.success,
        message: result.message,
        code: result.code,
      });
    }

    return res.status(200).json({
      success: result.success,
      message: result.message,
      code: result.code,
    });
  } catch (err) {
    console.error("Erro interno", err);

    return res.status(500).json({
      success: false,
      message: "Erro interno no servidor.",
      code: "INTERNAL_ERROR",
    });
  }
};

export const resend = async (req, res) => {
  try {
    const id = req.session.preAuth.IdUser;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Sessão expirada, refaça novamente o login.",
        code: "INVALID_SESSION",
      });
    }

    const result = await resendMail(id);

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
    console.error("Erro ao processar requisição", err);

    return res.status(500).json({
      success: false,
      message: "Erro ao processar requisição.",
      code: "INTERNAL_ERROR",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser({ email, password });

    if (!result.success) {
      const status = errorMap[result.code] || 500;

      if (result.code === "ACCOUNT_NOT_ACTIVE") {
        req.session.preAuth = {
          IdUser: result.userId,
        };

        return res.status(status).json({
          success: result.success,
          message: result.message,
          code: result.code,
        });
      }
      return res.status(status).json({
        success: result.success,
        message: result.message,
        code: result.code,
      });
    }

    req.session.preAuth = {
      IdUser: result.userId,
      is2FAPending: true,
    };

    return res.status(200).json({
      success: result.success,
      message: result.message,
      is2FAPending: result.is2FAPending,
      code: result.code,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Falha ao processar dados",
      code: "INTERNAL_ERROR",
    });
  }
};

export const verifyTwoFactorCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!req.session.preAuth) {
      return res.status(401).json({
        success: false,
        message: "Sessão inválida.",
        code: "UNAUTHORIZED",
      });
    }

    const userData = {
      code,
      id: req.session.preAuth.IdUser,
    };

    if (!userData.code || !/^\d{6}$/.test(userData.code)) {
      return res.status(400).json({
        success: false,
        message: "Código inválido.",
        code: "VALIDATION_ERROR",
      });
    }

    const result = await validateTwoFactorCode(userData);

    const status = errorMap[result.code] || 500;

    if (!result.success) {
      return res.status(status).json({
        success: result.success,
        message: result.message,
        code: result.code,
      });
    }

    req.session.user = {
      id: result.data.id,
      name: result.data.name,
    };

    delete req.session.preAuth;

    return res.status(200).json({
      success: true,
      message: "Usuário logado com sucesso",
      code: "LOGIN_SUCCESS",
      data: req.session.user,
    });
  } catch (err) {
    console.error("Erro ao processar dados.", err);
    return res.status(500).json({
      success: false,
      message: "Erro ao processar dados.",
      code: "INTERNAL_ERROR",
    });
  }
};

export const resendTwoFactorCode = async (req, res) => {
  try {
    if (!req.session.preAuth) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado.",
        code: "UNAUTHORIZED",
      });
    }
    const id = req.session.preAuth.IdUser;

    const result = await valideResendTwoFactorCode(id);

    if (!result.success) {
      const status = errorMap[result.code] || 500;

      return res.status(status).json({
        success: result.success,
        message: result.message,
        code: result.code,
      });
    }

    return res.status(200).json({
      success: result.success,
      message: result.message,
      code: result.code,
    });
  } catch (err) {
    console.error("Erro ao processar dados.", err);

    return res.status(500).json({
      success: false,
      message: "Erro ao processar dados.",
      code: "INTERNAL_ERROR",
    });
  }
};
