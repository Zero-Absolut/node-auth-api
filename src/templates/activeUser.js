export function activeUserTemplate(data) {
  return {
    html: `
            <div style="font-family: Arial; text-align: center;">

              <p>Para ativar sua conta, clique no botão abaixo:</p>

              <a href="http://localhost:3000/ativar?token=${data}"
                 style="
                   display: inline-block;
                   padding: 12px 20px;
                   background-color: black;
                   color: white;
                   text-decoration: none;
                   border-radius: 5px;
                   margin-top: 10px;
                 ">
                 Ativar Conta
              </a>

              <p style="margin-top:20px; font-size:12px; color:gray;">
                Se você não criou essa conta, ignore este email.
              </p>
            </div>
          `,
  };
}
