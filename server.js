const env = require("./src/config/env");
const connectDB = require("./src/config/db");
const app = require("./src/app");

(async () => {
  await connectDB();
  const server = app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}/api`);
    console.log(`Admin panel on http://localhost:${env.port}/admin`);
  });
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\nPort ${env.port} is already in use — another copy of the backend is probably running.`);
      console.error(`Stop it (close its terminal, or: npx kill-port ${env.port}) or set a different PORT in .env.\n`);
      process.exit(1);
    }
    throw err;
  });
})();
