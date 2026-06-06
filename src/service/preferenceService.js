import {
  User,
  UserLogs,
  PasswordHistories,
  UserSessions,
} from "../models/user.js";
import { createHash } from "../utils/createHash.js";

export const changeUserNameService = async (name, userId) => {
  try {
    const user = await User.findOne({
      where: {
        id: userId,
      },
      attributes: ["id", "name"],
    });

    if (!user) {
      return {
        success: false,
        message: "Usuário não encontrado.",
        code: "USER_NOT_FOUND",
      };
    }
    user.name = name;
    await user.save();

    await UserLogs.create({
      userId: user.id,
      action: "PROFILE_UPDATED",
      description: "Nome alterado com sucesso.",
    });

    return {
      success: true,
      message: "Nome alterado com sucesso.",
      code: "NAME_UPDATED",
    };
  } catch (err) {
    console.error("Erro ao acessar base de dados.", err);

    throw new Error(err);
  }
};

export const changeUserPasswordService = async ({ password }, userId) => {
  try {
    const user = await User.findOne({
      where: {
        id: userId,
      },
      attributes: ["id", "password"],
    });

    if (!user) {
      return {
        success: false,
        message: "Usuário não encontrado.",
        code: "USER_NOT_FOUND",
      };
    }
    const passwordHash = createHash(password);

    user.password = await passwordHash;
    await user.save();

    await UserLogs.create({
      userId: user.id,
      action: "PASSWORD_CHANGED",
      description: "Senha alterada com sucesso.",
    });

    return {
      success: true,
      message: "Senha alterada com sucesso.",
      code: "PASSWORD_CHANGED",
    };
  } catch (err) {
    console.error(err);

    throw new Error(err);
  }
};
export const deleteAccountService = async (userId) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return {
        success: false,
        message: "Usuário não encontrado.",
        code: "USER_NOT_FOUND",
      };
    }

    await UserSessions.destroy({
      where: {
        userId: userId,
      },
    });

    await PasswordHistories.destroy({
      where: {
        userId: userId,
      },
    });

    await UserLogs.destroy({
      where: {
        userId: userId,
      },
    });

    await user.destroy();

    return {
      success: true,
      message: "Conta removida com sucesso.",
      code: "ACCOUNT_DELETED",
    };
  } catch (err) {
    console.error("Erro ao acessar base de dados.", err);

    throw err;
  }
};
