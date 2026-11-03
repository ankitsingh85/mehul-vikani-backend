const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    cat: { type: String, trim: true, default: "Awareness" },
    date: { type: Date, default: Date.now },
    read: { type: String, trim: true },
    img: { type: String, trim: true },
    excerpt: { type: String, trim: true },
    body: [String], // legacy plain paragraphs (seeded posts); `content` takes precedence when set
    content: { type: String, default: "" }, // sanitized HTML from the rich text editor
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

blogSchema.index({ isPublished: 1, date: -1 });

module.exports = mongoose.model("Blog", blogSchema);
