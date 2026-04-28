import { Router } from "express";
import userRoutes from "./auth.route.js";

const route = Router();

route.use("/auth", userRoutes);

export default route;
