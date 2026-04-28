import { User } from "../models/user.js";
import { createPasswordHash } from "../utils/createPasswordHash.js";
import { createToken } from "../utils/createToken.js";
import { activeUserTemplate } from "../templates/activeUser.js";
import { sendEmail } from "../utils/sendMail.js";

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

    // ✔️ corrigido nome da função
    const passwordHash = await createPasswordHash(password);

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

    // ✔️ ajustado para pegar apenas o html
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
    // ✔️ mensagem ajustada (opcional, mas mais correta)
    console.error("Erro ao criar usuário:", err);

    return {
      success: false,
      message: "Erro ao interno, tente novamente.",
      code: "DATABASE_ACCESS_ERROR",
    };
  }
}
