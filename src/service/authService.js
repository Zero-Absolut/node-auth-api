import { User } from "../models/user.js";
import { createHash } from "../utils/createHash.js";
import { createToken } from "../utils/createToken.js";
import { activeUserTemplate } from "../templates/activeUser.js";
import { sendEmail } from "../utils/sendMail.js";

export async function createUser(value) {
  try {
    const { name, email, password } = value;

    const user = await User.findOne({
      where: { email },
      attributes: ["id", "email", "isActive"],
    });

    if (user) {
      if (user.isActive) {
        return {
          success: false,
          message: "Conta já ativa",
          code: "ACCOUNT_ALREADY_ACTIVE",
        };
      }
      return {
        success: false,
        message: "Usuário já cadastrado.",
        code: "USER_ALREADY_EXISTS",
      };
    }

    const passwordHash = await createHash(password);

    const token = createToken();
    const tokenHash = await createHash(token);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

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

export const resendMail = async (email) => {
  try {
    const user = await User.findOne({
      where: { email },
      attributes: [
        "id",
        "email",
        "activationToken",
        "tokenExpires",
        "isActive",
      ],
    });

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
    const tokenHash = await createHash(token);
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    user.activationToken = tokenHash;
    user.tokenExpires = expires;
    await user.save();

    const subject = "Ative sua conta.";
    const { html } = activeUserTemplate(token);

    try {
      await sendEmail({ email, subject, html });
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
