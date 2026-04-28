import crypto from "crypto";

export const createToken = () => crypto.randomBytes(32).toString("hex");
