const Appointment = require("../models/Appointment");
const Treatment = require("../models/Treatment");
const Blog = require("../models/Blog");
const Testimonial = require("../models/Testimonial");
const Faq = require("../models/Faq");
const Subscriber = require("../models/Subscriber");
const asyncHandler = require("../utils/asyncHandler");

exports.summary = asyncHandler(async (req, res) => {
  const [byStatus, treatments, blogs, testimonials, faqs, subscribers, recent] = await Promise.all([
    Appointment.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Treatment.countDocuments(),
    Blog.countDocuments(),
    Testimonial.countDocuments(),
    Faq.countDocuments(),
    Subscriber.countDocuments({ isActive: true }),
    Appointment.find().sort({ createdAt: -1 }).limit(5),
  ]);
  const appointments = Object.fromEntries(byStatus.map((s) => [s._id, s.count]));
  appointments.total = byStatus.reduce((n, s) => n + s.count, 0);
  res.json({ success: true, data: { appointments, treatments, blogs, testimonials, faqs, subscribers, recentAppointments: recent } });
});
