export function twoFactorAuthTemplate(code) {
  return {
    html: `
      <div style="font-family: Arial; text-align: center;">

        <h2>Autenticação em Dois Fatores</h2>

        <p>
          Utilize o código abaixo para concluir seu login:
        </p>

        <div
          style="
            display: inline-block;
            padding: 15px 25px;
            background-color: black;
            color: white;
            font-size: 28px;
            font-weight: bold;
            border-radius: 8px;
            letter-spacing: 5px;
            margin-top: 10px;
          "
        >
          ${code}
        </div>

        <p style="margin-top:20px;">
          Este código expira em alguns minutos.
        </p>

        <p style="margin-top:20px; font-size:12px; color:gray;">
          Se você não tentou acessar sua conta,
          recomendamos alterar sua senha imediatamente.
        </p>

      </div>
    `,
  };
}
