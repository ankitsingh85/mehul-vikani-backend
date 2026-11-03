const Subscriber = require("../models/Subscriber");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

exports.subscribe = asyncHandler(async (req, res) => {
  const email = String(req.body?.email || "").toLowerCase().trim();
  if (!email) throw new ApiError(400, "Email is required");
  await Subscriber.findOneAndUpdate({ email }, { email, isActive: true }, { upsert: true, runValidators: true });
  res.status(201).json({ success: true, message: "Subscribed successfully" });
});

exports.list = asyncHandler(async (req, res) => {
  const data = await Subscriber.find().sort({ createdAt: -1 });
  res.json({ success: true, data });
});

exports.remove = asyncHandler(async (req, res) => {
  const sub = await Subscriber.findByIdAndDelete(req.params.id);
  if (!sub) throw new ApiError(404, "Subscriber not found");
  res.json({ success: true, message: "Subscriber removed" });
});
