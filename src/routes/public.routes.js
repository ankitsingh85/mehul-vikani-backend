const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const content = require("./content");
const appointments = require("../controllers/appointment.controller");
const subscribers = require("../controllers/subscriber.controller");
const settings = require("../controllers/setting.controller");
const pages = require("../controllers/page.controller");

// Throttle public form submissions to limit spam
const formLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });

for (const [name, ctrl] of Object.entries(content)) {
  router.get(`/${name}`, ctrl.publicList);
  router.get(`/${name}/:id`, ctrl.publicGet);
}

router.get("/settings", settings.get);
router.get("/pages/:key", pages.get);
router.post("/appointments", formLimiter, appointments.create);
router.post("/subscribers", formLimiter, subscribers.subscribe);

module.exports = router;
