const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const env = require("./config/env");
const { notFound, errorHandler } = require("./middleware/error");
const { UPLOAD_DIR } = require("./middleware/upload");

const app = express();

app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        // + the website itself, whose own images ("/images/...") are previewed in the page editors
        "img-src": ["'self'", "data:", "blob:", "https:", ...(env.siteUrl ? [new URL(env.siteUrl).origin] : [])],
        // Video embeds in the blog editor preview
        "frame-src": ["https://www.youtube.com", "https://www.youtube-nocookie.com", "https://player.vimeo.com"],
      },
    },
  })
);
app.use(
  cors({
    // No Origin header = same-origin / server-to-server / curl
    origin: (origin, cb) => cb(null, !origin || env.corsOrigins.includes(origin)),
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
if (env.nodeEnv !== "test") app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/api/health", (req, res) => res.json({ success: true, status: "ok", time: new Date().toISOString() }));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api", require("./routes/public.routes"));

// Uploaded images; CORP header lets the website (another origin in production) display them
app.use(
  "/uploads",
  express.static(UPLOAD_DIR, {
    maxAge: "30d",
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("X-Content-Type-Options", "nosniff");
    },
  })
);

// Admin panel (static) + Quill rich text editor assets
const adminDir = path.join(__dirname, "..", "admin");
app.use("/admin/vendor/quill", express.static(path.join(path.dirname(require.resolve("quill/package.json")), "dist"), { maxAge: "7d" }));
app.get("/", (req, res) => res.redirect("/admin"));
app.get("/admin", (req, res) => res.sendFile(path.join(adminDir, "index.html")));
app.get("/admin/login", (req, res) => res.sendFile(path.join(adminDir, "login.html")));
app.use("/admin", express.static(adminDir));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
