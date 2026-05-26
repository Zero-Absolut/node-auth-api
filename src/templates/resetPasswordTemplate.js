export function resetPasswordTemplate(token) {
  return {
    html: `
      <div style="font-family: Arial; text-align: center;">

        <h2>Redefinição de Senha</h2>

        <p>
          Recebemos uma solicitação para redefinir a senha da sua conta.
        </p>

        <p>
          Para continuar, clique no botão abaixo:
        </p>

        <a href="http://127.0.0.1:5500/pages/reset-password.html?token=${token}"
           style="
             display: inline-block;
             padding: 12px 20px;
             background-color: black;
             color: white;
             text-decoration: none;
             border-radius: 5px;
             margin-top: 10px;
           ">
           Redefinir Senha
        </a>

        <p style="margin-top:20px; font-size:12px; color:gray;">
          Este link expirará em alguns minutos por segurança.
        </p>

        <p style="margin-top:10px; font-size:12px; color:gray;">
          Caso você não tenha solicitado a redefinição de senha, ignore este email.
        </p>

      </div>
    `,
  };
}
