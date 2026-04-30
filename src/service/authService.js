import { User } from "../models/user.js";
import { createdHash } from "../utils/createHash.js";
import { createToken } from "../utils/createToken.js";
import { activeUserTemplate } from "../templates/activeUser.js";
import { sendEmail } from "../utils/sendMail.js";
import { now } from "sequelize/lib/utils";

export async function createUser(value) {
  try {
    const { name, email, password } = value;

    const user = await User.findOne({
      where: { email },
    });

    if (user) {
      return {
        success: false,
        message: "Usuário já cadastrado.",
        code: "USER_ALREADY_EXISTS",
      };
    }

    const passwordHash = await createdHash(password);

    const token = createToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newUser = await User.create({
      name,
      email,
      password: passwordHash,
      isActive: false,
      activationToken: token,
      tokenExpires: expires,
    });

    const subject = "Ative sua conta.";

    const { html } = activeUserTemplate(token);

    const send = await sendEmail({ email, subject, html });

    if (!send.success) {
      newUser.activationToken = null;
      newUser.tokenExpires = null;

      await newUser.save();

      return {
        success: true,
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
    });

    if (!user) {
      return {
        success: false,
        message: "Usuário não encontrado.",
        code: "USER_NOT_FOUND",
      };
    }

    const token = createToken();
    const tokenHash = createUser(token);
    const expire = new Date(Date.now() + 60 * 60 * 1000);

    user.usersactivationToken = tokenHash;
    user.tokenExpires = expire;
    user.save();

    const subject = "Ative sua conta.";
    const { html } = activeUserTemplate(tokenHash);

    const resend = sendEmail({ email, subject, html });

    if (!resend) {
      // continuar daqui amanha
    }
  } catch (err) {
    console.error("Erro ao acessar base de dados.", err);

    return {
      success: false,
      message: "Erro interno, tente novamente.",
      code: "DATABASE_ACCESS_ERROR",
    };
  }
};
