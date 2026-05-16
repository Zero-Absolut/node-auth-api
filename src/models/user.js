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
    allowNull: true,
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  provider: {
    type: DataTypes.ENUM("local", "google"),
    defaultValue: "local",
  },

  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  activationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  tokenExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  twoFactorCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  twoFactorCodeExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  failed_login_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  unlockToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  unlockTokenExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});
// Sincroniza o model Produtos com o banco de dados
// force: false → não recria a tabela se ela já existir
User.sync({ force: false })
  .then(() => {
    console.log("Tabela Usuarios criada ou sincronizada com sucesso");
  })
  .catch((err) => {
    console.log("Erro ao criar/sincronizar tabela usuarios", err);
  });
