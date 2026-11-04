const Page = require("../models/Page");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const DEFAULTS = require("../data/pageDefaults.json");

// Saved sections are merged over the defaults, so fields added later still get a value
const merged = (key, saved = {}) =>
  Object.fromEntries(Object.entries(DEFAULTS[key]).map(([section, def]) => [section, { ...def, ...(saved[section] || {}) }]));

const pageKey = (req) => {
  if (!Object.hasOwn(DEFAULTS, req.params.key)) throw new ApiError(404, "Page not found");
  return req.params.key;
};

// Links, images and video embeds must be site paths or http(s) URLs (no javascript: etc.)
const URL_KEYS = new Set(["link", "img", "image", "image2", "videoUrl"]);
const SAFE_URL = /^(\/(?!\/)|https?:\/\/)/i;
const clean = (value, key) => {
  if (Array.isArray(value)) return value.map((v) => clean(v));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clean(v, k)]));
  if (typeof value === "string") {
    const s = value.trim();
    return URL_KEYS.has(key) && s && !SAFE_URL.test(s) ? "" : s;
  }
  return value;
};

exports.get = asyncHandler(async (req, res) => {
  const key = pageKey(req);
  const page = await Page.findOne({ key }).lean();
  res.json({ success: true, data: merged(key, page?.content), updatedAt: page?.updatedAt || null });
});

// Body: { section: "hero", data: { ...fields } } saves one section
exports.updateSection = asyncHandler(async (req, res) => {
  const key = pageKey(req);
  const { section, data } = req.body || {};
  if (!Object.hasOwn(DEFAULTS[key], section)) throw new ApiError(400, "Unknown page section");
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new ApiError(400, "Section data is required");

  const allowed = Object.fromEntries(Object.entries(clean(data)).filter(([k]) => Object.hasOwn(DEFAULTS[key][section], k)));
  const page = await Page.findOneAndUpdate(
    { key },
    { $set: { [`content.${section}`]: allowed } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();
  res.json({ success: true, data: merged(key, page.content), updatedAt: page.updatedAt });
});
