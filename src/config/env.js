require("dotenv").config();

const required = ["MONGO_URI", "JWT_SECRET"];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required env variable: ${key}`);
    process.exit(1);
  }
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  dbName: process.env.DB_NAME || "mehul_vikani",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  corsOrigins: (process.env.CORS_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean),
  // Public website address (defaults to the first CORS origin)
  siteUrl: (process.env.SITE_URL || (process.env.CORS_ORIGINS || "").split(",")[0] || "").trim().replace(/\/$/, ""),
  // Email notifications for new appointment / contact-form requests (disabled until SMTP_PASS is set)
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    fromName: process.env.MAIL_FROM_NAME || "Website",
    to: process.env.MAIL_TO || process.env.SMTP_USER,
  },
  superAdmin: {
    name: process.env.SUPERADMIN_NAME || "Super Admin",
    email: process.env.SUPERADMIN_EMAIL,
    password: process.env.SUPERADMIN_PASSWORD,
  },
};
