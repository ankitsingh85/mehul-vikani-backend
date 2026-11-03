const router = require("express").Router();
const { protect, authorize } = require("../middleware/auth");
const content = require("./content");
const dashboard = require("../controllers/dashboard.controller");
const appointments = require("../controllers/appointment.controller");
const subscribers = require("../controllers/subscriber.controller");
const settings = require("../controllers/setting.controller");
const admins = require("../controllers/admin.controller");
const uploads = require("../controllers/upload.controller");
const { singleImage } = require("../middleware/upload");

// Every admin route requires a valid JWT
router.use(protect);

const managers = authorize("superadmin", "admin");

router.get("/dashboard", dashboard.summary);

// Image uploads (cover images, editor images): all roles
router.post("/uploads", singleImage("file"), uploads.image);

// Website content: all roles (superadmin, admin, editor)
// Treatments are a fixed list: they can be edited and enabled/disabled, but not added or deleted
const FIXED = new Set(["treatments"]);
const notAllowed = (req, res) => res.status(405).json({ success: false, message: "Treatments cannot be added or deleted. Disable a treatment to hide it from the website." });
for (const [name, ctrl] of Object.entries(content)) {
  const fixed = FIXED.has(name);
  router.route(`/${name}`).get(ctrl.adminList).post(fixed ? notAllowed : ctrl.create);
  router.route(`/${name}/:id`).get(ctrl.adminGet).put(ctrl.update).delete(fixed ? notAllowed : ctrl.remove);
}

// Leads & site settings: superadmin + admin
router.get("/appointments", managers, appointments.list);
router.get("/appointments/export", managers, appointments.exportCsv); // before /:id so "export" isn't read as an id
router.route("/appointments/:id").all(managers).get(appointments.get).put(appointments.update).delete(appointments.remove);

router.get("/subscribers", managers, subscribers.list);
router.delete("/subscribers/:id", managers, subscribers.remove);

router.get("/settings", settings.get);
router.put("/settings", managers, settings.update);

// User management: superadmin only
router.route("/admins").all(authorize("superadmin")).get(admins.list).post(admins.create);
router.route("/admins/:id").all(authorize("superadmin")).put(admins.update).delete(admins.remove);

module.exports = router;
