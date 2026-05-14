import express from "express";
import authRoute from "./routes/index.js";
import * as user from "./models/user.js";
import cors from "cors";
import session from "express-session";

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 10,
    },
  }),
);

app.use(
  cors({
    origin: "http://127.0.0.1:5500",

    credentials: true,
  }),
);

app.use(express.json());
app.use("/api", authRoute);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "JSON inválido",
      code: "INVALID_JSON",
    });
  }

  next();
});

export default app;
