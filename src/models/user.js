import { DataTypes } from "sequelize";
import conn from "../database/apiAuth_db.js";

export const User = conn.define("users", {
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  activationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  tokenExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});
// Sincroniza o model Produtos com o banco de dados
// force: false → não recria a tabela se ela já existir
User.sync({ force: true })
  .then(() => {
    console.log("Tabela Usuarios criada ou sincronizada com sucesso");
  })
  .catch((err) => {
    console.log("Erro ao criar/sincronizar tabela usuarios", err);
  });
