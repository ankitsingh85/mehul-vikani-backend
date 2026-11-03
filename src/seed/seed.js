/**
 * Seeds the database with the website's current content and creates the super admin.
 *   npm run seed         -> insert content only into empty collections, create super admin if missing
 *   npm run seed:fresh   -> wipe content collections and re-insert (admins & appointments untouched)
 */
const mongoose = require("mongoose");
const env = require("../config/env");
const connectDB = require("../config/db");
const Admin = require("../models/Admin");
const Treatment = require("../models/Treatment");
const Blog = require("../models/Blog");
const Testimonial = require("../models/Testimonial");
const Faq = require("../models/Faq");
const Setting = require("../models/Setting");
const data = require("./data.json");

const fresh = process.argv.includes("--fresh");

const sets = [
  [Treatment, data.treatments.map((t, i) => ({ ...t, order: i, category: t.tag === "Non-Surgical" ? "Non-Surgical" : "Surgical" }))],
  [Blog, data.blogs.map((b) => ({ ...b, date: new Date(b.date) }))],
  [Testimonial, data.testimonials.map((t, i) => ({ ...t, order: i }))],
  [Faq, data.faqs.map((f, i) => ({ ...f, order: i }))],
];

(async () => {
  await connectDB();

  for (const [Model, docs] of sets) {
    if (fresh) await Model.deleteMany({});
    if ((await Model.countDocuments()) === 0) {
      await Model.insertMany(docs);
      console.log(`  ${Model.modelName}: inserted ${docs.length}`);
    } else {
      console.log(`  ${Model.modelName}: already has data, skipped`);
    }
  }

  const site = await Setting.getSite();
  if (fresh || !site.contact?.email) {
    site.contact = data.contact;
    site.stats = data.stats;
    await site.save();
    console.log("  Setting: site contact & stats saved");
  }

  const { name, email, password } = env.superAdmin;
  if (email && password) {
    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log(`  Super admin ${email} already exists`);
    } else {
      await Admin.create({ name, email, password, role: "superadmin" });
      console.log(`  Super admin created: ${email}`);
    }
  } else {
    console.log("  SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD not set, super admin not created");
  }

  await mongoose.disconnect();
  console.log("Seed complete");
})().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
