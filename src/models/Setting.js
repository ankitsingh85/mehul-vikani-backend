const mongoose = require("mongoose");

// Single-document collection holding site-wide content (contact details, stats)
const settingSchema = new mongoose.Schema(
  {
    key: { type: String, default: "site", unique: true },
    contact: {
      phone: String,
      phoneRaw: String,
      whatsapp: String,
      email: String,
      address: String,
      hours: String,
      emergency: String,
    },
    stats: [{ _id: false, value: Number, suffix: String, label: String }],
  },
  { timestamps: true }
);

settingSchema.statics.getSite = async function () {
  return (await this.findOne({ key: "site" })) || this.create({ key: "site" });
};

module.exports = mongoose.model("Setting", settingSchema);
