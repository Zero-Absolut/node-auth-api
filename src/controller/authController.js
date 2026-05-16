import {
  createUser,
  loginUser,
  resendMail,
  userActivateAccount,
  validateTwoFactorCode,
  valideResendTwoFactorCode,
  unlockUserAccount,
} from "../service/authService.js";

import { errorMap } from "../utils/errorMap.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const result = await createUser({ name, email, password });

    const status = errorMap[result.code] || 500;

    return res.status(status).json(result);
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

    return res.status(status).json(result);
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
    const id = req.session.preAuth?.IdUser;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Sessão expirada, refaça novamente o login.",
        code: "INVALID_SESSION",
      });
    }

    const result = await resendMail(id);

    const status = errorMap[result.code] || 500;

    return res.status(status).json(result);
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

    if (result.code === "ACCOUNT_NOT_ACTIVE" || result.success) {
      req.session.preAuth = {
        IdUser: result.userId,
        is2FAPending: result.success || undefined,
      };
    }

    const status = errorMap[result.code] || 500;

    return res.status(status).json(result);
  } catch (err) {
    console.error("Erro ao processar login", err);

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

    if (!code || !/^\d{6}$/.test(code)) {
      return res.status(400).json({
        success: false,
        message: "Código inválido.",
        code: "VALIDATION_ERROR",
      });
    }

    const result = await validateTwoFactorCode({
      code,
      id: req.session.preAuth.IdUser,
    });

    if (result.success) {
      req.session.user = result.data;

      delete req.session.preAuth;
    }

    const status = errorMap[result.code] || 500;

    return res.status(status).json(result);
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

    const status = errorMap[result.code] || 500;

    return res.status(status).json(result);
  } catch (err) {
    console.error("Erro ao processar dados.", err);

    return res.status(500).json({
      success: false,
      message: "Erro ao processar dados.",
      code: "INTERNAL_ERROR",
    });
  }
};

export const unlockAccount = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Necessário informar o e-mail.",
        code: "EMAIL_REQUIRED",
      });
    }

    const result = await unlockUserAccount(email);

    const status = errorMap[result.code];

    return res.status(status).json(result);
  } catch (err) {
    console.error(err, "Erro ao processar requisição");

    return res.status(500).json({
      success: false,
      message: "Erro ao processar requisição",
      code: "INTERNAL_ERROR",
    });
  }
};

export const logout = async (req, res) => {
  try {
    if (!req.session) {
      return res.status(401).json({
        success: false,
        message: "Sessão não encontrada.",
        code: "UNAUTHORIZED",
      });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Erro ao destruir sessão.", err);

        return res.status(500).json({
          success: false,
          message: "Erro ao realizar logout.",
          code: "LOGOUT_FAILED",
        });
      }

      res.clearCookie("connect.sid");

      return res.status(200).json({
        success: true,
        message: "Logout realizado com sucesso.",
        code: "LOGOUT_SUCCESS",
      });
    });
  } catch (err) {
    console.error("Erro interno.", err);

    return res.status(500).json({
      success: false,
      message: "Erro interno no servidor.",
      code: "INTERNAL_ERROR",
    });
  }
};
