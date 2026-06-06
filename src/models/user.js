import { DataTypes } from "sequelize";
import conn from "../database/apiAuth_db.js";

export const User = conn.define("users", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
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
    unique: true,
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

  resetPassToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  resetPassTokenExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});
//entidade  historico de senhas salvas do usuario
export const PasswordHistories = conn.define("password_histories", {
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

//entidade de sessions

export const UserSessions = conn.define("user_sessions", {
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

//entidade logs

export const UserLogs = conn.define("user_logs", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(UserLogs, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

UserLogs.belongsTo(User, {
  foreignKey: "userId",
  constraints: true,
});

//fim logs

User.hasMany(UserSessions, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

UserSessions.belongsTo(User, {
  constraints: true,
  foreignKey: "userId",
});

// hasMany
// "um possui vários"
User.hasMany(PasswordHistories, {
  foreignKey: "userId",
});
// belongsTo
// "esse pertence a um"
PasswordHistories.belongsTo(User, {
  constraints: true,
  foreignKey: "userId",
});
// Sincroniza o model Produtos com o banco de dados
// force: false → não recria a tabela se ela já existir
//force true recria tabela se a mesma existir
User.sync({ force: false })
  .then(() => {
    console.log("Tabela Usuarios criada ou sincronizada com sucesso");
  })
  .catch((err) => {
    console.log("Erro ao criar/sincronizar tabela usuarios", err);
  });

PasswordHistories.sync({ force: false });
UserSessions.sync({ force: false });
UserLogs.sync({ force: false });
