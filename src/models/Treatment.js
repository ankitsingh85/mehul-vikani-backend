const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    short: { type: String, trim: true },
    tag: { type: String, trim: true },
    category: { type: String, enum: ["Surgical", "Non-Surgical"], default: "Surgical" },
    image: { type: String, trim: true },
    duration: String,
    stay: String,
    loss: String,
    overview: String,
    docxContent: [String],
    benefits: [String],
    candidates: [String],
    steps: [{ _id: false, t: String, d: String }],
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Treatment", treatmentSchema);
