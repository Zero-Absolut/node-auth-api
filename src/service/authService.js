import { User, PasswordHistories } from "../models/user.js";
import { createHash } from "../utils/createHash.js";
import { createToken } from "../utils/createToken.js";
import { activeUserTemplate } from "../templates/activeUser.js";
import { twoFactorAuthTemplate } from "../templates/twoFactorAuthTemplate.js";
import { resetPasswordTemplate } from "../templates/resetPasswordTemplate.js";
import { sendEmail } from "../utils/sendMail.js";
import bcrypt from "bcrypt";
import { twoFactorCode } from "../utils/twoFactorCode.js";
import { unlockAccountTemplate } from "../templates/unlockUser.js";
import crypto from "crypto";

export async function createUser(value) {
  try {
    const { name, email, password } = value;

    const user = await User.findOne({
      where: { email },
      attributes: ["id", "email"],
    });

    if (user) {
      return {
        success: false,
        message: "Usuário já cadastrado.",
        code: "USER_ALREADY_EXISTS",
      };
    }

    const passwordHash = await createHash(password);

    const token = createToken();
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const passwordHistory = await PasswordHistories.create({
      passwordHash: passwordHash,
    });

    const newUser = await User.create({
      name,
      email,
      password: passwordHash,
      isActive: false,
      activationToken: tokenHash,
      tokenExpires: expires,
    });

    const subject = "Ative sua conta.";

    const { html } = activeUserTemplate(token);

    try {
      await sendEmail({ email, subject, html });
    } catch (err) {
      console.error("Erro ao enviar e-mail", err.message);
      return {
        success: false,
        message: "Usuário criado, mas não foi possível enviar o email.",
        code: "USER_CREATED_EMAIL_FAILED",
      };
    }

    return {
      success: true,
      message: "Usuário cadastrado com sucesso.",
      code: "USER_CREATED",
    };
  } catch (err) {
    console.error("Erro ao criar usuário:", err);

    return {
      success: false,
      message: "Erro ao interno, tente novamente.",
      code: "DATABASE_ACCESS_ERROR",
    };
  }
}

export const userActivateAccount = async (token) => {
  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      where: {
        activationToken: tokenHash,
      },
      attributes: ["id", "activationToken", "tokenExpires", "isActive"],
    });
    if (!user) {
      return {
        success: false,
        message: "Token inválido.",
        code: "INVALID_TOKEN",
      };
    }

    if (user.isActive) {
      return {
        success: false,
        message: "Conta já ativada.",
        code: "ACCOUNT_ALREADY_ACTIVE",
      };
    }

    if (user.tokenExpires < new Date()) {
      return {
        success: false,
        message: "Token expirado.",
        code: "TOKEN_EXPIRED",
      };
    }

    user.isActive = true;
    user.activationToken = null;
    user.tokenExpires = null;
    await user.save();

    return {
      success: true,
      message: "Conta ativada com sucesso.",
      code: "ACCOUNT_ACTIVATED",
    };
  } catch (err) {
    console.error("Erro ao processar dados.", err);

    return {
      success: false,
      message: "Erro ao validar token.",
      code: "INTERNAL_ERROR",
    };
  }
};

export const resendMail = async (id) => {
  try {
    const user = await User.findByPk(
      id,

      {
        attributes: [
          "id",
          "email",
          "activationToken",
          "tokenExpires",
          "isActive",
        ],
      },
    );

    if (!user) {
      return {
        success: false,
        message: "Usuário não encontrado.",
        code: "USER_NOT_FOUND",
      };
    }
    if (user.isActive) {
      return {
        success: false,
        message: "Conta já ativa.",
        code: "ACCOUNT_ALREADY_ACTIVE",
      };
    }

    const token = createToken();
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    user.activationToken = tokenHash;
    user.tokenExpires = expires;
    await user.save();

    const subject = "Ative sua conta.";
    const { html } = activeUserTemplate(token);

    try {
      await sendEmail({
        email: user.email,
        subject,
        html,
      });
    } catch (err) {
      console.error("erro ao reenviar e-mail", err.message);

      return {
        success: false,
        message: "Falha ao reenviar e-mail",
        code: "RESEND_EMAIL_FAILED",
      };
    }

    return {
      success: true,
      message: "E-mail reenviado com sucesso",
      code: "RESEND_EMAIL_SUCCESS",
      id: user.id,
    };
  } catch (err) {
    console.error("Erro ao acessar base de dados.", err);

    return {
      success: false,
      message: "Erro interno, tente novamente.",
      code: "DATABASE_ACCESS_ERROR",
    };
  }
};

export const loginUser = async (data) => {
  try {
    const { email, password } = data;

    const user = await User.findOne({
      where: { email },
      attributes: [
        "id",
        "email",
        "password",
        "isActive",
        "failed_login_attempts",
        "isBlocked",
      ],
    });
    if (!user) {
      return {
        success: false,
        message: "Usuário ou senha inválidos.",
        code: "USER_NOT_FOUND",
      };
    }

    if (user.isBlocked) {
      return {
        success: false,
        message:
          "Usuário bloqueado temporariamente, siga as intruções a seguir.",
        code: "ACCOUNT_BLOCKED",
        userId: user.id,
        failed_login_attempts: user.failed_login_attempts,
      };
    }
    if (!user.isActive) {
      return {
        success: false,
        message: "Ativa sua conta para concluir o login.",
        code: "ACCOUNT_NOT_ACTIVE",
        userId: user.id,
      };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      user.failed_login_attempts += 1;
      await user.save();

      if (user.failed_login_attempts === 5) {
        user.isBlocked = true;
        await user.save();

        return {
          success: false,
          message:
            "Usuário bloqueado temporariamente, siga as intruções a seguir.",
          code: "ACCOUNT_BLOCKED",
          userId: user.id,
          failed_login_attempts: user.failed_login_attempts,
        };
      }
      return {
        success: false,
        message: "Usuário ou senha inválidos.",
        code: "INVALID_CREDENTIALS",
        failed_login_attempts: user.failed_login_attempts,
      };
    }

    const code2fa = twoFactorCode();
    const hash2faCode = await createHash(code2fa);
    const expires = Date.now() + 30 * 60 * 1000;

    user.twoFactorCode = hash2faCode;
    user.twoFactorCodeExpires = expires;
    await user.save();

    const subject = "Valide seu login.";
    const { html } = twoFactorAuthTemplate(code2fa);

    try {
      await sendEmail({ email, subject, html });
    } catch (err) {
      console.error("Erro ao enviar e-mail", err.message);

      return {
        success: false,
        message: "Erro ao enviar e-mail",
        code: "EMAIL_NOT_SENT",
      };
    }

    return {
      success: true,
      is2FAPending: true,
      message:
        "Insira o codigo enviado para o e-mail de cadastro para validar o login",
      code: "TWO_FACTOR_REQUIRED",
      userId: user.id,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Erro ao acessar base de dados.",
      code: "DATABASE_ACCESS_ERROR",
    };
  }
};

export const validateTwoFactorCode = async (data) => {
  try {
    const { code, id } = data;

    const user = await User.findByPk(id, {
      attributes: [
        "id",
        "name",
        "twoFactorCode",
        "twoFactorCodeExpires",
        "failed_login_attempts",
      ],
    });

    if (!user) {
      return {
        success: false,
        message: "Código inválido.",
        code: "INVALID_CODE",
      };
    }

    if (user.twoFactorCodeExpires < new Date()) {
      return {
        success: false,
        message: "Código expirado",
        code: "CODE_EXPIRED",
      };
    }
    const codeMatch = await bcrypt.compare(code, user.twoFactorCode);

    if (!codeMatch) {
      return {
        success: false,
        message: "Código inválido",
        code: "INVALID_CODE",
      };
    }

    user.twoFactorCode = null;
    user.twoFactorCodeExpires = null;
    user.failed_login_attempts = 0;
    await user.save();

    return {
      success: true,
      message: "Código válido",
      code: "LOGIN_SUCCESS",
      data: {
        id: user.id,
        name: user.name,
      },
    };
  } catch (err) {
    console.error("Erro ao acessar base de dados", err);

    return {
      success: false,
      message: "Erro ao acessar base de dados.",
      code: "DATABASE_ACCESS_ERROR",
    };
  }
};

export const valideResendTwoFactorCode = async (id) => {
  try {
    const user = await User.findByPk(id, {
      attributes: [
        "id",
        "name",
        "email",
        "twoFactorCode",
        "twoFactorCodeExpires",
      ],
    });

    if (!user) {
      return {
        success: false,
        message: "Usuário não encontrado.",
        code: "USER_NOT_FOUND",
      };
    }

    const code2fa = twoFactorCode();
    const hash2faCode = await createHash(code2fa);
    const expires = Date.now() + 30 * 60 * 1000;
    const email = user.email;
    user.twoFactorCode = hash2faCode;
    user.twoFactorCodeExpires = expires;
    await user.save();

    const subject = "Valide seu login.";
    const { html } = twoFactorAuthTemplate(code2fa);

    try {
      await sendEmail({ email, subject, html });
    } catch (err) {
      console.error("Erro ao enviar e-mail", err.message);

      return {
        success: false,
        message: "Erro ao enviar e-mail",
        code: "EMAIL_NOT_SENT",
      };
    }

    return {
      success: true,
      is2FAPending: true,
      message:
        "Insira o codigo enviado para o e-mail de cadastro para validar o login",
      code: "TWO_FACTOR_REQUIRED",
      userId: user.id,
    };
  } catch (err) {
    console.error("Erro ao acessar base de dados.", err);

    return {
      success: false,
      message: "Erro ao acessar base de dados.",
      code: "DATABASE_ACCESS_ERROR",
    };
  }
};

export const unlockUserAccount = async (email) => {
  try {
    const user = await User.findOne({
      where: { email },
      attributes: [
        "id",
        "name",
        "email",
        "isBlocked",
        "unlockToken",
        "unlockTokenExpires",
        "isActive",
      ],
    });

    if (!user) {
      return {
        success: false,
        message: "Usuario não encontrado",
        code: "USER_NOT_FOUND",
      };
    }
    if (!user.isActive) {
      return {
        success: false,
        message: "Ative sua conta.",
        code: "ACCOUNT_NOT_ACTIVATED",
      };
    }
    if (!user.isBlocked) {
      return {
        success: false,
        message: "Usuário ativo",
        code: "ACCOUNT_ALREADY_ACTIVE",
      };
    }

    const token = createToken();
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    const subject = "Desbloqueie sua conta";
    const { html } = unlockAccountTemplate(token);

    user.unlockToken = tokenHash;
    user.unlockTokenExpires = expires;
    await user.save();

    try {
      await sendEmail({ email: user.email, subject, html });
    } catch (err) {
      console.error("Erro ao enviar e-mail", err.message);
      return {
        success: false,
        message: "Não foi possível enviar o email.",
        code: "EMAIL_NOT_SENT",
      };
    }

    return {
      success: true,
      message: "E-mail enviado com sucesso.",
      code: "UNLOCK_EMAIL_SENT",
    };
  } catch (err) {
    console.error(err, "Erro ao acessar base de dados");

    return {
      success: false,
      message: "Erro ao acessar base de dados",
      code: "DATABASE_ACCESS_ERROR",
    };
  }
};

export const validateUnlockTokenService = async (token) => {
  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      where: {
        unlockToken: tokenHash,
      },

      attributes: [
        "id",
        "name",
        "email",
        "unlockToken",
        "unlockTokenExpires",
        "failed_login_attempts",
        "isBlocked",
      ],
    });

    if (!user) {
      return {
        success: false,
        message: "Token inválido.",
        code: "INVALID_TOKEN",
      };
    }

    if (!user.isBlocked) {
      return {
        success: false,
        message: "Conta não bloqueada.",
        code: "ACCOUNT_NOT_BLOCKED",
      };
    }

    if (user.unlockTokenExpires < new Date()) {
      return {
        success: false,
        message: "Token expirado",
        code: "TOKEN_EXPIRED",
      };
    }

    user.unlockToken = null;
    user.unlockTokenExpires = null;
    user.failed_login_attempts = 0;
    user.isBlocked = false;
    await user.save();

    return {
      success: true,
      message: "Conta desbloqueada com sucesso.",
      code: "ACCOUNT_UNLOCKED",
    };
  } catch (err) {
    console.error("Erro ao acessar base de dados", err);

    return {
      success: false,
      message: "Erro ao acessar base de dados",
      code: "DATABASE_ACCESS_ERROR",
    };
  }
};

export const forgotPasswordService = async (email) => {
  try {
    const user = await User.findOne({
      where: { email },

      attributes: ["id", "resetPassToken", "resetPassTokenExpires"],
    });

    if (!user) {
      return {
        success: false,
        message: "Usuário não encontrado.",
        code: "USER_NOT_FOUND",
      };
    }

    const forgotToken = createToken();

    const forgotHashToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex");
    const forgotExpiresToken = new Date(Date.now() + 15 * 60 * 1000);

    const subject = "Redefina sua senha.";

    const { html } = resetPasswordTemplate(forgotToken);

    user.resetPassToken = forgotHashToken;
    user.resetPassTokenExpires = forgotExpiresToken;
    await user.save();

    try {
      await sendEmail({ email: email, subject, html });
    } catch (err) {
      console.error("Erro ao enviar e-mail", err.message);
      return {
        success: false,
        message: "Não foi possível enviar o email.",
        code: "EMAIL_NOT_SENT",
      };
    }

    return {
      success: true,
      message: "E-mail enviado com sucesso.",
      code: "PASSWORD_RESET_EMAIL_SENT",
    };
  } catch (err) {
    console.error("Erro ao acessar base de dados.", err);

    return {
      success: false,
      message: "Erro ao acessar base de dados.",
      code: "DATABASE_ACCESS_ERROR",
    };
  }
};

export const validTokenresetPasswordService = async (data) => {
  try {
    const { password, token } = data;

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const passwordHash = await createHash(password);

    const user = await User.findOne({
      where: {
        resetPassToken: tokenHash,
      },
      attributes: [
        "id",
        "password",
        "resetPassToken",
        "resetPassTokenExpires",
        "failed_login_attempts",
      ],
    });

    if (!user) {
      return {
        success: false,
        message: "Usuário não encontrado.",
        code: "USER_NOT_FOUND",
      };
    }
    if (user.resetPassTokenExpires < new Date()) {
      return {
        success: false,
        message: "Token expirado.",
        code: "TOKEN_EXPIRED",
      };
    }

    const oldPasswords = await PasswordHistories.findAll({
      where: {
        userId: user.id,
      },

      // ordena do mais novo para o mais antigo
      order: [["createdAt", "DESC"]],

      // limita quantidade
      limit: 5,
    });
    //primeiro elemento do for e uma variavel q represnta o valor do indice do array(elemento) e o segundo e o array em si
    for (const oldPassword of oldPasswords) {
      const isSamePassword = await bcrypt.compare(
        password,
        oldPassword.passwordHash,
      );
      if (isSamePassword) {
        return {
          success: false,
          message: "A nova senha deve ser diferente da atual.",
          code: "PASSWORD_MUST_BE_DIFFERENT",
        };
      }
    }

    await PasswordHistories.create({
      // senha antiga atual
      passwordHash: user.password,

      // dono da senha
      userId: user.id,
    });

    user.failed_login_attempts = 0;
    user.resetPassToken = null;
    user.resetPassTokenExpires = null;
    user.password = passwordHash;

    await user.save();

    return {
      success: true,
      message: "Senha alterada com sucesso.",
      code: "PASSWORD_RESET_SUCCESS",
    };
  } catch (err) {
    console.error("Erro ao acessar base de dados", err);

    return {
      success: false,
      message: "Erro ao acessar base de dados",
      code: "DATABASE_ACCESS_ERROR",
    };
  }
};
