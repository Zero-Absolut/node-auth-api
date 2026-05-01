import nodemailer from "nodemailer";

export async function sendEmail({ email, subject, html }) {
  try {
    if (!email || !subject || !html) {
      throw new Error("INVALID_EMAIL_DATA");
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
    throw new Error("EMAIL_SEND_ERROR");
  }
}
