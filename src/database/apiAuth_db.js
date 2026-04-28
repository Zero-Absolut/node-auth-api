import { Sequelize } from "sequelize";

const conn = new Sequelize("authApi", "root", "123456", {
  host: "localhost",
  dialect: "mysql",
});

async function conectDB() {
  try {
    await conn.authenticate();
    console.log("conectado ao banco.");
  } catch (err) {
    console.error("Erro ao conectar ao banco", err);
  }
}

conectDB();

export default conn;
