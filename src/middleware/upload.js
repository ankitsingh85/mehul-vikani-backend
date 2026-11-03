const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const ApiError = require("../utils/ApiError");

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const TYPES = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif" };

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    // Random name + extension derived from the mime type (never from the client's filename)
    filename: (req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${TYPES[file.mimetype]}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => cb(TYPES[file.mimetype] ? null : new ApiError(400, "Only JPG, PNG, WebP or GIF images are allowed"), !!TYPES[file.mimetype]),
});

// Wraps multer so its errors go through the normal error handler with a clear message
exports.singleImage = (field = "file") => (req, res, next) =>
  upload.single(field)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return next(new ApiError(400, err.code === "LIMIT_FILE_SIZE" ? "Image must be 5 MB or smaller" : err.message));
    }
    next(err);
  });

exports.UPLOAD_DIR = UPLOAD_DIR;
