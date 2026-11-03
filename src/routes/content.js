const crudFactory = require("../controllers/crud.factory");
const Treatment = require("../models/Treatment");
const Blog = require("../models/Blog");
const Testimonial = require("../models/Testimonial");
const Faq = require("../models/Faq");
const { sanitize, toText } = require("../utils/richText");

// Sanitize editor HTML and fill read time / excerpt from it when left blank
const prepareBlog = (body) => {
  if (body.date === "" || body.date === null) delete body.date; // blank date: keep existing / default to now
  if (body.content === undefined) return body;
  // Quill emits non-breaking spaces between words, which would stop text from wrapping on the website
  body.content = sanitize(String(body.content).replace(/&nbsp;| /g, " "));
  const text = toText(body.content);
  if (text && !body.read) body.read = `${Math.max(1, Math.round(text.split(" ").length / 200))} min`;
  if (text && !body.excerpt) body.excerpt = text.length > 160 ? `${text.slice(0, 157).trimEnd()}…` : text;
  return body;
};

// Shared content controllers, used by both public and admin routers
module.exports = {
  treatments: crudFactory(Treatment, { slugFrom: "title", filters: ["category", "tag"], search: ["title", "short"] }),
  blogs: crudFactory(Blog, { sort: { date: -1 }, slugFrom: "title", filters: ["cat"], search: ["title", "excerpt"], prepare: prepareBlog }),
  testimonials: crudFactory(Testimonial, { filters: ["proc"], search: ["name", "text"] }),
  faqs: crudFactory(Faq, { filters: ["cat"], search: ["q", "a"] }),
};
