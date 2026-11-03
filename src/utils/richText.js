const sanitizeHtml = require("sanitize-html");

// Allow-list matching what the admin's Quill editor can produce
const OPTIONS = {
  allowedTags: ["p", "br", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em", "i", "u", "s", "sub", "sup", "a", "ul", "ol", "li", "blockquote", "pre", "code", "img", "iframe", "span", "hr"],
  allowedAttributes: {
    "*": ["style", "class"],
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "height"],
    iframe: ["src", "width", "height", "frameborder", "allowfullscreen", "allow"],
    pre: ["data-language", "spellcheck"],
  },
  allowedClasses: { "*": [/^ql-[\w-]+$/] },
  allowedStyles: {
    "*": {
      color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i],
      "background-color": [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i],
      "text-align": [/^(left|right|center|justify)$/],
      "font-size": [/^\d+(\.\d+)?(px|em|rem)$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
  // Only embed videos from known providers
  allowedIframeHostnames: ["www.youtube.com", "youtube.com", "www.youtube-nocookie.com", "player.vimeo.com"],
  exclusiveFilter: (frame) => frame.tag === "iframe" && !frame.attribs.src,
  transformTags: {
    a: (tagName, attribs) => ({ tagName, attribs: { ...attribs, ...(attribs.target === "_blank" && { rel: "noopener noreferrer" }) } }),
  },
};

exports.sanitize = (html) => sanitizeHtml(String(html || ""), OPTIONS).trim();

// Plain text for excerpts/read time; block boundaries become spaces so words don't run together
exports.toText = (html) =>
  sanitizeHtml(String(html || "").replace(/<\/(p|h[1-6]|li|blockquote|pre)>|<br\s*\/?>/gi, " "), { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
