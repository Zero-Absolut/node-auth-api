import app from "./src/app.js";
import { config } from "./src/config/config.js";
import { cleanupExpiredSessions } from "./src/jobs/sessionCleanup.js";

setInterval(
  async () => {
    await cleanupExpiredSessions();
  },
  60 * 60 * 1000,
);

app.listen(config.port, () => {
  console.log("Servidor rodando...");
});
