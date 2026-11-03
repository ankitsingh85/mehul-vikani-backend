const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    cat: { type: String, trim: true, default: "General" },
    q: { type: String, required: true, trim: true },
    a: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Faq", faqSchema);
