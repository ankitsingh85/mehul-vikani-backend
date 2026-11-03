const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ROLES = ["superadmin", "admin", "editor"];

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"] },
    password: { type: String, required: true, minlength: [8, "Password must be at least 8 characters"], select: false },
    role: { type: String, enum: ROLES, default: "editor" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
    passwordChangedAt: Date,
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  // Tokens issued before this moment become invalid (1s skew for the token issued right after)
  if (!this.isNew) this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

adminSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

adminSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Admin", adminSchema);
module.exports.ROLES = ROLES;
