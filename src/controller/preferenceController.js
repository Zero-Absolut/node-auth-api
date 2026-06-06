import { errorMap } from "../utils/errorMap.js";
import {
  changeUserNameService,
  changeUserPasswordService,
  deleteAccountService,
} from "../service/preferenceService.js";

export const changeUserNameController = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.session.user.id;

    const result = await changeUserNameService(name, userId);
    const status = errorMap[result.code];

    return res.status(status).json(result);
  } catch (err) {
    console.error("Erro interno do sistema.", err);

    return res.status(500).json({
      success: false,
      message: "Erro interno do sistema.",
      code: "INTERNAL_ERROR",
    });
  }
};

export const changeUserPasswordController = async (req, res) => {
  try {
    const { password } = req.body;

    const userId = req.session.user.id;

    const result = await changeUserPasswordService(password, userId);

    const status = errorMap[result.code];

    return res.status(status).json(result);
  } catch (err) {
    console.error("Erro interno do sistema.", err);

    return res.status(500).json({
      success: false,
      message: "Erro interno do sistema.",
      code: "INTERNAL_ERROR",
    });
  }
};

export const deleteAccountController = async (req, res) => {
  try {
    const result = await deleteAccountService(req.session.user.id);

    const status = errorMap[result.code];
    res.clearCookie("token");
    return res.status(status).json(result);
  } catch (err) {
    console.error("Erro interno do sistema", err);

    return res.status(500).json({
      success: false,
      message: "Erro interno do sistema.",
      code: "INTERNAL_ERROR",
    });
  }
};
