export function unlockAccountTemplate(token) {
  return {
    html: `
            <div style="font-family: Arial; text-align: center;">

              <p>Sua conta foi bloqueada temporariamente.</p>

              <p>Para desbloquear sua conta, clique no botão abaixo:</p>

              <a href="http://127.0.0.1:5500/pages/unlock-account.html?token=${token}"
                 style="
                   display: inline-block;
                   padding: 12px 20px;
                   background-color: black;
                   color: white;
                   text-decoration: none;
                   border-radius: 5px;
                   margin-top: 10px;
                 ">
                 Desbloquear Conta
              </a>

              <p style="margin-top:20px; font-size:12px; color:gray;">
                Se você não realizou essas tentativas de login, altere sua senha imediatamente.
              </p>
            </div>
          `,
  };
}
