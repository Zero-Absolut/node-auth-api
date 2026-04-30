import { Router } from "express";
import {
  validateRules,
  validateRulesUser,
} from "../middlewares/validateRegister.js";
import { register } from "../controller/authController.js";
const route = Router();

route.post("/register", validateRules, validateRulesUser, register);
export default route;

//route.post("/resend", )
