const env = require("./src/config/env");
const connectDB = require("./src/config/db");
const app = require("./src/app");
const { mailEnabled, transporter } = require("./src/utils/mailer");

(async () => {
  await connectDB();
  const server = app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}/api`);
    console.log(`Admin panel on http://localhost:${env.port}/admin`);
    if (!mailEnabled) console.log("Appointment emails are off: set SMTP_PASS in .env to turn them on");
    else transporter.verify().then(
      () => console.log(`Appointment emails on: sending to ${env.smtp.to}`),
      (err) => console.error(`Appointment emails: SMTP login failed (${err.message})`)
    );
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
