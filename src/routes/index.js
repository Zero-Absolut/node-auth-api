import { Router } from "express";
import userRoutes from "./auth.route.js";
import googleRoutes from "./google-route.js";

const route = Router();

route.use("/auth", userRoutes);

route.use("/auth", googleRoutes);

export default route;
