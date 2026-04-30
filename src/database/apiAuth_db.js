import { Sequelize } from "sequelize";
import { config } from "../config/config.js";

const conn = new Sequelize(config.db, config.db_user, config.db_pass, {
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
