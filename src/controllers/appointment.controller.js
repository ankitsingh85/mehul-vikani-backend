const Appointment = require("../models/Appointment");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const escapeRegex = require("../utils/escapeRegex");
const { notifyNewAppointment } = require("../utils/mailer");

// Public: submitted from the website appointment form (accepts the form's `date` field as preferredDate)
exports.create = asyncHandler(async (req, res) => {
  const { name, phone, email, treatment, date, preferredDate, message } = req.body || {};
  const appointment = await Appointment.create({
    name,
    phone,
    email,
    treatment: treatment || undefined,
    preferredDate: preferredDate || date || undefined,
    message,
  });
  notifyNewAppointment(appointment); // not awaited: the patient shouldn't wait on SMTP
  res.status(201).json({ success: true, message: "Appointment request received", data: { id: appointment._id } });
});

// ?status= and ?q= filters shared by the list and the CSV export
const buildQuery = (query) => {
  const q = {};
  if (query.status) q.status = String(query.status);
  if (query.q) {
    const rx = new RegExp(escapeRegex(query.q), "i");
    q.$or = [{ name: rx }, { phone: rx }, { email: rx }, { treatment: rx }];
  }
  return q;
};

exports.list = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const q = buildQuery(req.query);
  const [data, total] = await Promise.all([
    Appointment.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Appointment.countDocuments(q),
  ]);
  res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

// Quote every cell; prefix values Excel would treat as formulas (=, +, -, @) so they stay plain text
const csvCell = (v) => {
  let s = v === undefined || v === null ? "" : String(v);
  // "+91 98…" phone numbers: a leading space keeps Excel from treating them as formulas without a visible apostrophe
  if (/^\+[\d\s-]+$/.test(s)) s = ` ${s}`;
  else if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};
const ist = (d, withTime) =>
  d ? new Date(d).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", ...(withTime && { hour: "2-digit", minute: "2-digit" }) }) : "";

exports.exportCsv = asyncHandler(async (req, res) => {
  const rows = await Appointment.find(buildQuery(req.query)).sort({ createdAt: -1 }).lean();
  const header = ["Name", "Phone", "Email", "Treatment", "Preferred date", "Message", "Status", "Internal notes", "Received (IST)"];
  const lines = rows.map((a) =>
    [a.name, a.phone, a.email, a.treatment, ist(a.preferredDate), a.message, a.status, a.notes, ist(a.createdAt, true)].map(csvCell).join(",")
  );
  const stamp = new Date().toISOString().slice(0, 10);
  const label = req.query.status ? `-${String(req.query.status).replace(/[^a-z]/gi, "")}` : "";
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="appointments${label}-${stamp}.csv"`);
  // BOM so Excel opens UTF-8 (₹, names with accents) correctly
  res.send("﻿" + [header.map(csvCell).join(","), ...lines].join("\r\n"));
});

exports.get = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) throw new ApiError(404, "Appointment not found");
  res.json({ success: true, data: appointment });
});

exports.update = asyncHandler(async (req, res) => {
  const allowed = ["status", "notes", "preferredDate", "treatment"];
  const body = Object.fromEntries(allowed.filter((k) => req.body[k] !== undefined).map((k) => [k, req.body[k]]));
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
  if (!appointment) throw new ApiError(404, "Appointment not found");
  res.json({ success: true, data: appointment });
});

exports.remove = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);
  if (!appointment) throw new ApiError(404, "Appointment not found");
  res.json({ success: true, message: "Appointment deleted" });
});
