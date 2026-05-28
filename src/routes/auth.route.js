import { Router } from "express";
import {
  validateRules,
  validateRulesUser,
  validateLogin,
  validateLoginUser,
  valideResetPassword,
  valideResetPasswordUser,
} from "../middlewares/validateRegister.js";
import {
  register,
  resend,
  login,
  activateAccount,
  verifyTwoFactorCode,
  resendTwoFactorCode,
  logout,
  unlockAccount,
  validateUnlockTokenController,
  validTokenresetPassworController,
  forgotPasswordController,
} from "../controller/authController.js";

const route = Router();

route.post("/register", validateRules, validateRulesUser, register);

route.get("/activate-account", activateAccount);

route.post("/resend", resend);

route.post("/login", validateLogin, validateLoginUser, login);

route.post("/verify-2fa", verifyTwoFactorCode);

route.post("/resend-2fa", resendTwoFactorCode);

route.post("/logout", logout);

route.post("/unlockAccount", unlockAccount);

route.get("/unlockAccount", validateUnlockTokenController);

route.post("/forgot-password", forgotPasswordController);

route.post(
  "/reset-password",
  valideResetPassword,
  valideResetPasswordUser,
  validTokenresetPassworController,
);

//route.post("/google", googleLogin)

export default route;
