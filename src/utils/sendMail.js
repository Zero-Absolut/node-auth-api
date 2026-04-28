import nodemailer from "nodemailer";

export async function sendEmail({ email, subject, html }) {
  try {
    if (!email || !subject || !html) {
      console.log("Dados inválidos para envio:", { email, subject, html });
      return { success: false, message: "Dados inválidos no envio de email" };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"authApiUser" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: html,
    });

    console.log("Email enviado:", info.response);

    return { success: true, message: "E-mail enviado com sucesso" };
  } catch (erro) {
    console.error("Erro ao enviar email:", erro);
    return { success: false, message: "Erro ao enviar email" };
  }
}
