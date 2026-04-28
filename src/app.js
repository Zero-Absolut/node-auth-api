import express from "express";
import authRoute from "./routes/index.js";
import * as user from "./models/user.js";
const app = express();

app.use(express.json());
app.use("/api", authRoute);

export default app;
