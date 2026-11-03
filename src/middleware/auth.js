const jwt = require("jsonwebtoken");
const env = require("../config/env");
const Admin = require("../models/Admin");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// Accepts "Authorization: Bearer <token>" or the httpOnly "token" cookie
exports.protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : req.cookies?.token;
  if (!token) throw new ApiError(401, "Not authenticated");

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const admin = await Admin.findById(payload.id);
  if (!admin || !admin.isActive) throw new ApiError(401, "Account not found or disabled");
  if (admin.passwordChangedAt && payload.iat * 1000 < admin.passwordChangedAt.getTime()) {
    throw new ApiError(401, "Password changed, please log in again");
  }

  req.admin = admin;
  next();
});

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin.role)) return next(new ApiError(403, "You do not have permission for this action"));
  next();
};
