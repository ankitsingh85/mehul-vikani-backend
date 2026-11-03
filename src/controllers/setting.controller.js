const Setting = require("../models/Setting");
const asyncHandler = require("../utils/asyncHandler");

exports.get = asyncHandler(async (req, res) => {
  const site = await Setting.getSite();
  res.json({ success: true, data: site });
});

exports.update = asyncHandler(async (req, res) => {
  const site = await Setting.getSite();
  if (req.body.contact) site.contact = { ...(site.contact ? site.contact.toObject() : {}), ...req.body.contact };
  if (Array.isArray(req.body.stats)) site.stats = req.body.stats;
  await site.save();
  res.json({ success: true, data: site });
});
