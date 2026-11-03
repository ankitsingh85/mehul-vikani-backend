const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const auth = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts, try again in 15 minutes" },
});

router.post("/login", loginLimiter, auth.login);
router.post("/logout", auth.logout);
router.get("/me", protect, auth.me);
router.put("/change-password", protect, auth.changePassword);

module.exports = router;
