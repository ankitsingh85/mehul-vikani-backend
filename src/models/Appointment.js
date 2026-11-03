const mongoose = require("mongoose");

const STATUSES = ["new", "contacted", "confirmed", "completed", "cancelled"];

const appointmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true, minlength: [2, "Please enter your full name"], maxlength: 100 },
    phone: { type: String, required: [true, "Phone is required"], trim: true, match: [/^[+\d\s-]{10,15}$/, "Invalid phone number"] },
    email: { type: String, trim: true, lowercase: true, match: [/^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"] },
    treatment: { type: String, trim: true, default: "General Consultation" },
    preferredDate: { type: Date },
    message: { type: String, trim: true, maxlength: 2000 },
    status: { type: String, enum: STATUSES, default: "new" },
    notes: { type: String, trim: true, maxlength: 2000 },
    source: { type: String, default: "website" },
  },
  { timestamps: true }
);

appointmentSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
module.exports.STATUSES = STATUSES;
