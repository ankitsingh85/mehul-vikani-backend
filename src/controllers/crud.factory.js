const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const slugify = require("../utils/slugify");
const escapeRegex = require("../utils/escapeRegex");

/**
 * Builds public + admin handlers for a content model.
 * opts.sort      default sort
 * opts.slugFrom  field used to auto-generate `slug` when missing
 * opts.filters   query-string keys allowed as exact-match filters
 * opts.search    fields searched with ?q=
 * opts.prepare   (body) => body, applied to create/update payloads (e.g. sanitizing HTML)
 */
module.exports = function crudFactory(Model, opts = {}) {
  const { sort = { order: 1, createdAt: -1 }, slugFrom, filters = [], search = [], prepare = (b) => b } = opts;
  const hasSlug = !!Model.schema.path("slug");

  const buildQuery = (query, publicOnly) => {
    const q = publicOnly ? { isPublished: true } : {};
    for (const key of filters) if (query[key]) q[key] = String(query[key]);
    if (!publicOnly && query.isPublished !== undefined) q.isPublished = query.isPublished === "true";
    if (query.q && search.length) {
      const rx = new RegExp(escapeRegex(query.q), "i");
      q.$or = search.map((f) => ({ [f]: rx }));
    }
    return q;
  };

  const findOne = (idOrSlug, publicOnly) => {
    const cond = mongoose.isValidObjectId(idOrSlug) ? { _id: idOrSlug } : hasSlug ? { slug: idOrSlug } : null;
    if (!cond) return null;
    return Model.findOne(publicOnly ? { ...cond, isPublished: true } : cond);
  };

  const withSlug = (body) => {
    if (body.slug) body.slug = slugify(body.slug);
    else if (slugFrom && body[slugFrom]) body.slug = slugify(body[slugFrom]);
    return body;
  };

  const list = (publicOnly) =>
    asyncHandler(async (req, res) => {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
      const q = buildQuery(req.query, publicOnly);
      const [data, total] = await Promise.all([
        Model.find(q).sort(sort).skip((page - 1) * limit).limit(limit),
        Model.countDocuments(q),
      ]);
      res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    });

  const get = (publicOnly) =>
    asyncHandler(async (req, res) => {
      const doc = await findOne(req.params.id, publicOnly);
      if (!doc) throw new ApiError(404, `${Model.modelName} not found`);
      res.json({ success: true, data: doc });
    });

  return {
    publicList: list(true),
    publicGet: get(true),
    adminList: list(false),
    adminGet: get(false),

    create: asyncHandler(async (req, res) => {
      const doc = await Model.create(prepare(withSlug({ ...req.body })));
      res.status(201).json({ success: true, data: doc });
    }),

    update: asyncHandler(async (req, res) => {
      const body = prepare(withSlug({ ...req.body }));
      delete body._id;
      const doc = await Model.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
      if (!doc) throw new ApiError(404, `${Model.modelName} not found`);
      res.json({ success: true, data: doc });
    }),

    remove: asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) throw new ApiError(404, `${Model.modelName} not found`);
      res.json({ success: true, message: `${Model.modelName} deleted` });
    }),
  };
};
