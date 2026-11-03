const jwt = require("jsonwebtoken");
const env = require("../config/env");
const Admin = require("../models/Admin");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const signToken = (admin) => jwt.sign({ id: admin._id, role: admin.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: env.nodeEnv === "production",
  maxAge: 24 * 60 * 60 * 1000,
};

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) throw new ApiError(400, "Email and password are required");

  const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() }).select("+password");
  if (!admin || !(await admin.comparePassword(String(password)))) throw new ApiError(401, "Invalid email or password");
  if (!admin.isActive) throw new ApiError(403, "Account is disabled");

  admin.lastLoginAt = new Date();
  await admin.save({ validateBeforeSave: false });

  const token = signToken(admin);
  res.cookie("token", token, cookieOptions);
  res.json({ success: true, token, admin });
});

exports.logout = (req, res) => {
  const { maxAge, ...clearOptions } = cookieOptions;
  res.clearCookie("token", clearOptions);
  res.json({ success: true, message: "Logged out" });
};

exports.me = (req, res) => res.json({ success: true, admin: req.admin });

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) throw new ApiError(400, "Current and new password are required");

  const admin = await Admin.findById(req.admin._id).select("+password");
  if (!(await admin.comparePassword(String(currentPassword)))) throw new ApiError(401, "Current password is incorrect");

  admin.password = String(newPassword);
  await admin.save();

  const token = signToken(admin);
  res.cookie("token", token, cookieOptions);
  res.json({ success: true, message: "Password updated", token });
});
