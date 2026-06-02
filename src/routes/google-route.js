import { Router } from "express";
import passport from "../config/passport.js";

import { googleCallbackController } from "../controller/authGoogle.js";
const route = Router();

route.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

route.get(
  "/callback",
  passport.authenticate("google", {
    session: false,
  }),
  googleCallbackController,
);
export default route;
