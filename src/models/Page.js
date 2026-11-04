const mongoose = require("mongoose");

// Editable content of a static page (home, about), stored as { sectionName: { ...fields } }
const pageSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false }
);

module.exports = mongoose.model("Page", pageSchema);
