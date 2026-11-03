const Admin = require("../models/Admin");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const pick = (obj, keys) => Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]]));

exports.list = asyncHandler(async (req, res) => {
  const admins = await Admin.find().sort({ createdAt: -1 });
  res.json({ success: true, data: admins });
});

exports.create = asyncHandler(async (req, res) => {
  const admin = await Admin.create(pick(req.body, ["name", "email", "password", "role", "isActive"]));
  res.status(201).json({ success: true, data: admin });
});

exports.update = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) throw new ApiError(404, "Admin not found");

  const isSelf = admin._id.equals(req.admin._id);
  if (isSelf && ((req.body.role && req.body.role !== admin.role) || req.body.isActive === false)) {
    throw new ApiError(400, "You cannot change your own role or disable yourself");
  }

  Object.assign(admin, pick(req.body, ["name", "email", "role", "isActive"]));
  if (req.body.password) admin.password = req.body.password;
  await admin.save();
  res.json({ success: true, data: admin });
});

exports.remove = asyncHandler(async (req, res) => {
  if (req.params.id === String(req.admin._id)) throw new ApiError(400, "You cannot delete your own account");
  const admin = await Admin.findByIdAndDelete(req.params.id);
  if (!admin) throw new ApiError(404, "Admin not found");
  res.json({ success: true, message: "Admin deleted" });
});
