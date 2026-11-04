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
    // "procedure" pages live at /treatments/:slug; "care" pages (diet, medication) at /obesity-treatment-options/:slug
    pageType: { type: String, enum: ["procedure", "care"], default: "procedure" },
    menuLabel: { type: String, trim: true }, // shorter name for menus and lists (falls back to title)
    heroTitle: { type: String, trim: true },
    heroHighlight: { type: String, trim: true },
    heroDesc: { type: String, trim: true },
    heading: { type: String, trim: true }, // detail section heading (falls back to title)
    listHeading: { type: String, trim: true }, // care pages: heading above the benefits list
    noteTitle: { type: String, trim: true },
    noteText: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Treatment", treatmentSchema);
