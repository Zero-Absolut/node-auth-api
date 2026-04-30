import "dotenv/config";
export const config = {
  port: process.env.SERVER_PORT,
  db_user: process.env.DB_USER,
  db_pass: process.env.DB_PASS,
  db: process.env.DB,
};
