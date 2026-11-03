const ApiError = require("../utils/ApiError");

exports.image = (req, res) => {
  if (!req.file) throw new ApiError(400, "No image received");
  res.status(201).json({ success: true, url: `/uploads/${req.file.filename}` });
};
