import { Router } from "express";
import {
  validateRules,
  validateRulesUser,
  validateLogin,
  validateLoginUser,
} from "../middlewares/validateRegister.js";
import {
  register,
  resend,
  login,
  activateAccount,
  verifyTwoFactorCode,
} from "../controller/authController.js";
const route = Router();

route.post("/register", validateRules, validateRulesUser, register);
export default route;

route.get("/activate-account", activateAccount);

route.post("/resend", resend);

route.post("/login", validateLogin, validateLoginUser, login);

route.post("/verify-2fa", verifyTwoFactorCode);
