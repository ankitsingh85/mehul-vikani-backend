// Small fetch wrapper. Auth uses the httpOnly JWT cookie set by /api/auth/login.
window.api = async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: "same-origin",
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = {};
  try {
    json = await res.json();
  } catch {
    /* empty body */
  }
  if (res.status === 401 && !path.startsWith("/auth/")) {
    window.location.href = "/admin/login?expired=1";
    throw new Error("Session expired");
  }
  if (!res.ok) throw new Error(json.message || `Request failed (${res.status})`);
  return json;
};

// Uploads one image file; resolves to its URL (e.g. "/uploads/123-abc.jpg")
window.uploadImage = async function uploadImage(file) {
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) throw new Error("Only JPG, PNG, WebP or GIF images are allowed");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5 MB or smaller");
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/uploads", { method: "POST", credentials: "same-origin", body });
  const json = await res.json().catch(() => ({}));
  if (res.status === 401) {
    window.location.href = "/admin/login?expired=1";
    throw new Error("Session expired");
  }
  if (!res.ok) throw new Error(json.message || `Upload failed (${res.status})`);
  return json.url;
};

window.escapeHtml = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
