(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = window.escapeHtml;
  const content = $("#content");
  let me = null;

  /* ================= icons (lucide-style, stroke) ================= */
  const ICON_PATHS = {
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    stethoscope: '<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>',
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
    quote: '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.76-2.02-2-2H4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .01-1 1.03V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.76-2.02-2-2h-4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    whatsapp: '<path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    collapse: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M16 15l-3-3 3-3"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    trend: '<path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    sparkle: '<path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2z"/>',
  };
  const icon = (name, size = 18, cls = "") =>
    `<svg class="ico ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ""}</svg>`;

  /* ================= helpers ================= */
  const initials = (name = "") => name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "?";
  const AVATAR_TONES = ["tone-green", "tone-blue", "tone-amber", "tone-violet", "tone-rose", "tone-teal"];
  const tone = (s = "") => AVATAR_TONES[[...s].reduce((n, c) => n + c.charCodeAt(0), 0) % AVATAR_TONES.length];
  const avatar = (name, size = "") => `<span class="avatar ${size} ${tone(name)}">${esc(initials(name))}</span>`;
  const fmtDate = (d, withTime = false) =>
    d ? new Date(d).toLocaleString("en-IN", withTime ? { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" } : { day: "numeric", month: "short", year: "numeric" }) : "—";
  const timeAgo = (d) => {
    if (!d) return "—";
    const s = Math.floor((Date.now() - new Date(d)) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
    return fmtDate(d);
  };
  const truncate = (s, n = 60) => (s && s.length > n ? s.slice(0, n).trimEnd() + "…" : s || "");
  const debounce = (fn, ms = 300) => {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), ms);
    };
  };
  const store = {
    get: (k) => {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    },
    set: (k, v) => {
      try {
        localStorage.setItem(k, v);
      } catch {
        /* ignore */
      }
    },
  };
  const skeleton = (rows = 5) =>
    `<div class="card"><div class="skeleton-list">${Array.from({ length: rows }, () => '<div class="skeleton-row"><span class="sk sk-avatar"></span><span class="sk sk-line"></span><span class="sk sk-line short"></span></div>').join("")}</div></div>`;
  const emptyState = (ico, title, text, action = "") =>
    `<div class="empty"><div class="empty-icon">${icon(ico, 26)}</div><h3>${esc(title)}</h3><p class="muted">${esc(text)}</p>${action}</div>`;

  /* ================= toasts ================= */
  const toast = (msg, type = "ok") => {
    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    el.innerHTML = `${icon(type === "ok" ? "check" : "alert", 16)}<span>${esc(msg)}</span>`;
    $("#toasts").appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 300);
    }, 3200);
  };

  /* ================= confirm dialog ================= */
  const confirmDialog = ({ title, text, okLabel = "Delete", danger = true, ico = "trash" }) =>
    new Promise((resolve) => {
      const d = $("#dialog");
      $("#dialog-title").textContent = title;
      $("#dialog-text").textContent = text;
      $("#dialog-icon").innerHTML = icon(ico, 22);
      $("#dialog-icon").className = `dialog-icon ${danger ? "is-danger" : ""}`;
      const ok = $("#dialog-ok");
      ok.textContent = okLabel;
      ok.className = `btn ${danger ? "btn-danger-solid" : "btn-primary"}`;
      d.hidden = false;
      requestAnimationFrame(() => d.classList.add("open"));
      ok.focus();
      const close = (val) => {
        d.classList.remove("open");
        setTimeout(() => (d.hidden = true), 180);
        ok.onclick = $("#dialog-cancel").onclick = d.onkeydown = null;
        resolve(val);
      };
      ok.onclick = () => close(true);
      $("#dialog-cancel").onclick = () => close(false);
      d.onkeydown = (e) => e.key === "Escape" && close(false);
    });

  /* ================= pop-up (forms & details) ================= */
  // Kept under the name "drawer"; it renders as a centered modal (bottom sheet on phones).
  let drawerDirty = false;
  const drawer = {
    open(title, sub, html, { wide = false, ico } = {}) {
      const d = $("#drawer");
      $("#drawer .drawer-panel").classList.toggle("wide", wide);
      $("#drawer-icon").innerHTML = icon(ico || (/^add/i.test(title) ? "plus" : /^edit/i.test(title) ? "edit" : "eye"), 20);
      $("#drawer-title").textContent = title;
      $("#drawer-sub").textContent = sub || "";
      $("#drawer-body").innerHTML = html;
      $("#drawer-body").scrollTop = 0;
      drawerDirty = false;
      d.hidden = false;
      document.body.classList.add("no-scroll");
      requestAnimationFrame(() => d.classList.add("open"));
      // focus the first field so typing can start immediately
      setTimeout(() => $("#drawer-body").querySelector("input:not([type=hidden]):not([type=file]), textarea, select")?.focus({ preventScroll: true }), 220);
    },
    close() {
      const d = $("#drawer");
      d.classList.remove("open");
      document.body.classList.remove("no-scroll");
      setTimeout(() => {
        d.hidden = true;
        $("#drawer-body").innerHTML = "";
      }, 200);
    },
    // Outside click / Escape: close, unless there are unsaved edits (then nudge instead)
    dismiss() {
      if (!drawerDirty) return drawer.close();
      const p = $("#drawer .drawer-panel");
      p.classList.remove("nudge");
      void p.offsetWidth;
      p.classList.add("nudge");
      toast("You have unsaved changes. Use Cancel to discard them.", "err");
    },
  };
  $("#drawer").addEventListener("click", (e) => e.target.closest("[data-close]") && drawer.close());
  $("#drawer-backdrop").addEventListener("click", () => drawer.dismiss());
  $("#drawer-body").addEventListener("input", () => (drawerDirty = true));
  document.addEventListener("keydown", (e) => e.key === "Escape" && !$("#drawer").hidden && $("#dialog").hidden && drawer.dismiss());

  /* ================= form builder ================= */
  const imagePreview = (url) => (url ? `<img src="${esc(url)}" alt="" />` : `${icon("image", 26)}<span>Drop image or click</span>`);

  // Rich text editor (Quill — the editor behind React Quill)
  const RTE_TOOLBAR = [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block", "link"],
    ["image", "video"],
    ["clean"],
  ];
  if (window.Quill) window.Quill.register(window.Quill.import("attributors/style/align"), true); // inline alignment renders anywhere

  const pickImageFile = () =>
    new Promise((resolve) => {
      const input = Object.assign(document.createElement("input"), { type: "file", accept: "image/jpeg,image/png,image/webp,image/gif" });
      input.onchange = () => resolve(input.files[0] || null);
      input.click();
    });

  function createEditor(el, html) {
    if (!window.Quill) {
      el.innerHTML = '<div class="notice notice-err">The editor failed to load. Refresh the page and try again.</div>';
      return null;
    }
    const insertImages = async (quill, files, range) => {
      let index = (range || quill.getSelection(true) || { index: quill.getLength() }).index;
      for (const file of files) {
        try {
          toast("Uploading image…");
          const url = await uploadImage(file);
          quill.insertEmbed(index, "image", url, "user");
          index += 1;
          quill.setSelection(index, 0, "silent");
        } catch (ex) {
          toast(ex.message, "err");
        }
      }
    };
    const quill = new window.Quill(el, {
      theme: "snow",
      bounds: el.parentElement,
      placeholder: "Start writing your article… Use the toolbar to add headings, lists, links, images and videos.",
      modules: {
        toolbar: {
          container: RTE_TOOLBAR,
          handlers: {
            image: async () => {
              const file = await pickImageFile();
              if (file) insertImages(quill, [file], quill.getSelection(true));
            },
          },
        },
        // Pasted or dropped image files are uploaded instead of being inlined as base64
        uploader: { handler: (range, files) => insertImages(quill, files, range) },
      },
    });
    if (html) quill.clipboard.dangerouslyPasteHTML(html, "silent");
    quill.history.clear();
    return quill;
  }
  const editorHtml = (quill) => (quill.getText().trim() || quill.root.querySelector("img, iframe") ? quill.getSemanticHTML().replace(/&nbsp;/g, " ") : "");

  // Field types: text, url, email, password, number, textarea, select, toggle, date, image, richtext, lines (string[]), steps ({t,d}[])
  // f.initial(doc) overrides the stored value when building the form (e.g. converting legacy data).
  // { section: "Title" } entries start a new group.
  const toInput = (f, v) => {
    const name = `name="${f.name}"`;
    const ph = f.placeholder ? `placeholder="${esc(f.placeholder)}"` : "";
    switch (f.type) {
      case "textarea":
        return `<textarea ${name} rows="${f.rows || 4}" ${ph}>${esc(v)}</textarea>`;
      case "lines":
        return `<textarea ${name} rows="${f.rows || 5}" placeholder="One item per line">${esc((v || []).join("\n"))}</textarea>`;
      case "steps":
        return `<textarea ${name} rows="5" placeholder="Step title | Step description (one per line)">${esc((v || []).map((s) => `${s.t} | ${s.d}`).join("\n"))}</textarea>`;
      case "select":
        return `<div class="select-wrap"><select ${name}>${f.options.map((o) => `<option value="${esc(o)}" ${o === v ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>${icon("chevron", 16)}</div>`;
      case "toggle":
        return `<span class="switch"><input type="checkbox" ${name} ${v ? "checked" : ""} /><span class="switch-track"></span></span>`;
      case "date":
        return `<input type="date" ${name} value="${v ? new Date(v).toISOString().slice(0, 10) : ""}" />`;
      case "image":
        return `<div class="image-field">
          <div class="image-drop" data-preview="${f.name}" data-drop="${f.name}" title="Drop an image here or click to upload">${imagePreview(v)}</div>
          <div class="image-controls">
            <div class="image-buttons">
              <button type="button" class="btn btn-soft btn-sm" data-upload="${f.name}">${icon("upload", 15)} <span data-upload-label="${f.name}">${v ? "Change image" : "Upload from computer"}</span></button>
              <button type="button" class="btn btn-ghost btn-sm image-remove" data-remove-image="${f.name}" ${v ? "" : "hidden"}>${icon("trash", 15)} Remove</button>
            </div>
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" data-file-for="${f.name}" hidden />
            <input type="hidden" ${name} value="${esc(v)}" />
            <small class="muted">Click the box or drag an image onto it. JPG, PNG, WebP or GIF, up to 5 MB.</small>
          </div>
        </div>`;
      case "richtext":
        return `<div class="rte"><div class="rte-editor" data-rte="${f.name}"></div></div>`;
      default:
        return `<input type="${f.type || "text"}" ${name} value="${esc(v)}" ${ph} />`;
    }
  };

  const formHtml = (fields, doc = {}) => {
    let html = '<form class="form" id="entity-form" novalidate>';
    let open = false;
    const openSection = (title) => {
      if (open) html += "</div></div>";
      html += `<div class="form-section">${title ? `<h4 class="form-section-title">${esc(title)}</h4>` : ""}<div class="form-grid">`;
      open = true;
    };
    for (const f of fields) {
      if (f.section) {
        openSection(f.section);
        continue;
      }
      if (!open) openSection();
      const wide = f.full || ["textarea", "lines", "steps", "image", "richtext"].includes(f.type);
      const value = f.initial ? f.initial(doc) : doc[f.name] ?? f.default;
      // Fields holding buttons/editors can't live inside <label> (clicks would be forwarded to the first button)
      const tag = ["image", "richtext"].includes(f.type) ? "div" : "label";
      if (f.type === "toggle") {
        html += `<label class="toggle-row full"><div><div class="field-label">${esc(f.label)}</div>${f.hint ? `<div class="muted small">${esc(f.hint)}</div>` : ""}</div>${toInput(f, value)}</label>`;
      } else {
        html += `<${tag} class="field ${wide ? "full" : ""}"><span class="field-label">${esc(f.label)}${f.required ? ' <i class="req">*</i>' : ""}</span>${toInput(f, value)}${f.hint ? `<small class="muted">${esc(f.hint)}</small>` : ""}</${tag}>`;
      }
    }
    html += `</div></div>
      <div class="notice notice-err" id="form-error" hidden></div>
      <div class="drawer-foot"><button type="button" class="btn btn-ghost" data-close>Cancel</button><button type="submit" class="btn btn-primary">${icon("check", 16)} Save changes</button></div>
    </form>`;
    return html;
  };

  const readForm = (form, fields, editors = {}) => {
    const out = {};
    for (const f of fields) {
      if (!f.name) continue;
      if (f.type === "richtext") {
        if (editors[f.name]) out[f.name] = editorHtml(editors[f.name]);
        continue;
      }
      const el = form.elements[f.name];
      if (!el) continue;
      if (f.type === "toggle") out[f.name] = el.checked;
      else if (f.type === "number") out[f.name] = el.value === "" ? undefined : Number(el.value);
      else if (f.type === "lines") out[f.name] = el.value.split("\n").map((s) => s.trim()).filter(Boolean);
      else if (f.type === "steps")
        out[f.name] = el.value
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => {
            const [t, ...d] = l.split("|");
            return { t: t.trim(), d: d.join("|").trim() };
          });
      else if (f.type === "password" && !el.value) continue;
      else out[f.name] = el.value.trim();
    }
    return out;
  };

  const openForm = (title, sub, fields, doc, onSave) => {
    const hasEditor = fields.some((f) => f.type === "richtext");
    drawer.open(title, sub, formHtml(fields, doc), { wide: hasEditor });
    const form = $("#entity-form");

    const editors = {};
    for (const f of fields.filter((x) => x.type === "richtext")) {
      editors[f.name] = createEditor(form.querySelector(`[data-rte="${f.name}"]`), f.initial ? f.initial(doc) : doc[f.name]);
    }

    // ----- image fields: URL typing, file picker, drag & drop -----
    const setImage = (name, url) => {
      form.elements[name].value = url;
      form.querySelector(`[data-preview="${name}"]`).innerHTML = imagePreview(url);
      form.querySelector(`[data-upload-label="${name}"]`).textContent = url ? "Change image" : "Upload from computer";
      form.querySelector(`[data-remove-image="${name}"]`).hidden = !url;
    };
    const uploadInto = async (name, file) => {
      if (!file) return;
      const box = form.querySelector(`[data-preview="${name}"]`);
      const before = form.elements[name].value;
      box.classList.add("is-uploading");
      box.innerHTML = '<span class="spinner"></span><span>Uploading…</span>';
      try {
        setImage(name, await uploadImage(file));
        toast("Image uploaded");
      } catch (ex) {
        setImage(name, before);
        toast(ex.message, "err");
      } finally {
        box.classList.remove("is-uploading");
      }
    };
    form.addEventListener("input", (e) => {
      const prev = form.querySelector(`[data-preview="${e.target.name}"]`);
      if (prev) prev.innerHTML = imagePreview(e.target.value.trim());
    });
    form.addEventListener("click", (e) => {
      const removeKey = e.target.closest("[data-remove-image]")?.dataset.removeImage;
      if (removeKey) return setImage(removeKey, "");
      const name = e.target.closest("[data-upload], [data-drop]")?.dataset;
      const key = name?.upload || name?.drop;
      if (key) form.querySelector(`[data-file-for="${key}"]`).click();
    });
    form.addEventListener("change", (e) => {
      const key = e.target.dataset.fileFor;
      if (key) {
        uploadInto(key, e.target.files[0]);
        e.target.value = "";
      }
    });
    form.querySelectorAll("[data-drop]").forEach((zone) => {
      zone.addEventListener("dragover", (e) => {
        e.preventDefault();
        zone.classList.add("is-over");
      });
      zone.addEventListener("dragleave", () => zone.classList.remove("is-over"));
      zone.addEventListener("drop", (e) => {
        e.preventDefault();
        zone.classList.remove("is-over");
        uploadInto(zone.dataset.drop, e.dataTransfer.files[0]);
      });
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const err = $("#form-error");
      err.hidden = true;
      const missing = fields.filter((f) => f.required && form.elements[f.name] && !form.elements[f.name].value.trim() && !(f.type === "password" && doc._id));
      form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
      if (missing.length) {
        missing.forEach((f) => form.elements[f.name].classList.add("invalid"));
        err.textContent = `Please fill in: ${missing.map((f) => f.label).join(", ")}`;
        err.hidden = false;
        return;
      }
      const btn = form.querySelector("[type=submit]");
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Saving…';
      try {
        await onSave(readForm(form, fields, editors));
        drawer.close();
      } catch (ex) {
        err.textContent = ex.message;
        err.hidden = false;
        btn.disabled = false;
        btn.innerHTML = `${icon("check", 16)} Save changes`;
      }
    });
  };

  /* ================= page chrome ================= */
  const setHead = (title, desc, actions = "") => {
    $("#page-title").textContent = title;
    $("#page-desc").textContent = desc || "";
    $("#page-actions").innerHTML = actions;
  };
  const pill = (text, cls) => `<span class="pill ${cls}"><i></i>${esc(text)}</span>`;
  const publishedPill = (v) => pill(v ? "Published" : "Draft", v ? "pill-green" : "pill-gray");

  /* ================= content resources ================= */
  const RESOURCES = {
    treatments: {
      label: "Treatments",
      singular: "treatment",
      desc: "Procedures shown on the Treatments pages of the website.",
      icon: "stethoscope",
      thumb: "image",
      primary: "title",
      secondary: (d) => truncate(d.short, 70),
      filter: { key: "category", label: "All categories", options: ["Surgical", "Non-Surgical"] },
      columns: [
        { label: "Category", render: (d) => pill(d.category || "Surgical", d.category === "Non-Surgical" ? "pill-blue" : "pill-violet") },
        { label: "Duration", render: (d) => esc(d.duration || "—") },
        { label: "Hospital stay", render: (d) => esc(d.stay || "—") },
      ],
      fields: [
        { section: "Basics" },
        { name: "title", label: "Title", required: true, full: true },
        { name: "slug", label: "URL slug", hint: "Leave blank to generate from the title" },
        { name: "tag", label: "Badge", placeholder: "e.g. Most Popular" },
        { name: "category", label: "Category", type: "select", options: ["Surgical", "Non-Surgical"] },
        { name: "order", label: "Display order", type: "number", default: 0 },
        { name: "image", label: "Cover image", type: "image" },
        { name: "short", label: "Short description", type: "textarea", rows: 2 },
        { section: "Key facts" },
        { name: "duration", label: "Surgery duration", placeholder: "60–90 mins" },
        { name: "stay", label: "Hospital stay", placeholder: "2–3 days" },
        { name: "loss", label: "Expected weight loss", full: true, placeholder: "60–70% excess weight" },
        { section: "Details" },
        { name: "overview", label: "Overview", type: "textarea", rows: 5 },
        { name: "docxContent", label: "Detailed content (one paragraph per line)", type: "lines", rows: 6 },
        { name: "benefits", label: "Benefits", type: "lines" },
        { name: "candidates", label: "Ideal candidates", type: "lines" },
        { name: "steps", label: "Treatment steps", type: "steps" },
        { section: "Visibility" },
        { name: "isPublished", label: "Published", hint: "Show this treatment on the website", type: "toggle", default: true },
      ],
    },
    blogs: {
      label: "Blog Posts",
      singular: "blog post",
      desc: "Articles shown on the Blogs page of the website.",
      icon: "book",
      thumb: "img",
      primary: "title",
      secondary: (d) => truncate(d.excerpt, 70),
      filter: { key: "cat", label: "All categories", options: ["Awareness", "Nutrition", "Metabolic", "Lifestyle", "Procedures"] },
      columns: [
        { label: "Category", render: (d) => pill(d.cat || "—", "pill-violet") },
        { label: "Published on", render: (d) => fmtDate(d.date) },
        { label: "Read time", render: (d) => esc(d.read || "—") },
      ],
      fields: [
        { section: "Post" },
        { name: "title", label: "Title", required: true, full: true },
        { name: "slug", label: "URL slug", hint: "Leave blank to generate from the title" },
        { name: "cat", label: "Category", type: "select", options: ["Awareness", "Nutrition", "Metabolic", "Lifestyle", "Procedures"] },
        { name: "date", label: "Publish date", type: "date", initial: (d) => d.date || new Date() },
        { name: "read", label: "Read time", placeholder: "Auto-calculated if blank" },
        { name: "img", label: "Cover image", type: "image" },
        { name: "excerpt", label: "Excerpt", type: "textarea", rows: 2, hint: "Short summary for the blog list. Taken from the article if left blank." },
        { section: "Article" },
        {
          name: "content",
          label: "Content",
          type: "richtext",
          // Posts created before the editor existed only have plain paragraphs in `body`
          initial: (d) => d.content || (d.body || []).map((p) => `<p>${esc(p)}</p>`).join(""),
        },
        { section: "Visibility" },
        { name: "isPublished", label: "Published", hint: "Show this post on the website", type: "toggle", default: true },
      ],
    },
    testimonials: {
      label: "Testimonials",
      singular: "testimonial",
      desc: "Patient success stories shown on the home and results pages.",
      icon: "quote",
      thumb: "img",
      round: true,
      primary: "name",
      secondary: (d) => [d.proc, d.age ? `${d.age} yrs` : ""].filter(Boolean).join(" · "),
      columns: [
        { label: "Weight lost", render: (d) => (d.lost ? `<span class="metric">${icon("trend", 14)} ${esc(d.lost)}</span>` : "—") },
        { label: "Review", render: (d) => `<span class="muted">“${esc(truncate(d.text, 80))}”</span>`, wide: true },
      ],
      fields: [
        { section: "Patient" },
        { name: "name", label: "Patient name", required: true },
        { name: "age", label: "Age", type: "number" },
        { name: "proc", label: "Procedure" },
        { name: "lost", label: "Weight lost", placeholder: "42 kg" },
        { name: "img", label: "Patient photo", type: "image" },
        { section: "Story" },
        { name: "text", label: "Testimonial", type: "textarea", required: true, rows: 6 },
        { name: "order", label: "Display order", type: "number", default: 0 },
        { section: "Visibility" },
        { name: "isPublished", label: "Published", hint: "Show this testimonial on the website", type: "toggle", default: true },
      ],
    },
    faqs: {
      label: "FAQs",
      singular: "FAQ",
      desc: "Questions and answers shown on the FAQ page.",
      icon: "help",
      primary: "q",
      secondary: (d) => truncate(d.a, 90),
      filter: { key: "cat", label: "All categories", options: ["General", "Medication", "Non-Surgical", "Surgery", "Recovery", "Metabolic"] },
      columns: [
        { label: "Category", render: (d) => pill(d.cat || "General", "pill-violet") },
        { label: "Order", render: (d) => esc(d.order ?? 0) },
      ],
      fields: [
        { name: "q", label: "Question", required: true, full: true },
        { name: "a", label: "Answer", type: "textarea", required: true, rows: 6 },
        { name: "cat", label: "Category", type: "select", options: ["General", "Medication", "Non-Surgical", "Surgery", "Recovery", "Metabolic"] },
        { name: "order", label: "Display order", type: "number", default: 0 },
        { name: "isPublished", label: "Published", hint: "Show this FAQ on the website", type: "toggle", default: true },
      ],
    },
  };

  async function renderResource(key) {
    const r = RESOURCES[key];
    setHead(r.label, r.desc, `<button class="btn btn-primary" id="add-btn">${icon("plus", 16)} Add ${esc(r.singular)}</button>`);
    content.innerHTML = `
      <div class="card table-card">
        <div class="toolbar">
          <div class="search-box">${icon("search", 16)}<input id="search" placeholder="Search ${esc(r.label.toLowerCase())}…" /></div>
          <div class="toolbar-filters">
            ${r.filter ? `<div class="select-wrap select-sm"><select id="cat-filter"><option value="">${esc(r.filter.label)}</option>${r.filter.options.map((o) => `<option>${esc(o)}</option>`).join("")}</select>${icon("chevron", 14)}</div>` : ""}
            <div class="segmented" id="pub-filter">
              <button data-v="" class="active">All</button><button data-v="true">Published</button><button data-v="false">Drafts</button>
            </div>
          </div>
        </div>
        <div id="table-area">${skeleton(5).replace('<div class="card">', "<div>")}</div>
      </div>`;

    let pub = "";
    let data = [];
    const load = async () => {
      const q = $("#search").value.trim();
      const cat = $("#cat-filter")?.value;
      const params = new URLSearchParams({ limit: "100" });
      if (q) params.set("q", q);
      if (cat) params.set(r.filter.key, cat);
      if (pub) params.set("isPublished", pub);
      ({ data } = await api(`/admin/${key}?${params}`));
      const area = $("#table-area");
      if (!data.length) {
        area.innerHTML = emptyState(r.icon, `No ${r.label.toLowerCase()} found`, q || cat || pub ? "Try a different search or filter." : `Add your first ${r.singular} to show it on the website.`);
        return;
      }
      area.innerHTML = `<div class="table-scroll"><table class="table">
        <thead><tr><th>${esc(r.singular[0].toUpperCase() + r.singular.slice(1))}</th>${r.columns.map((c) => `<th>${esc(c.label)}</th>`).join("")}<th>Status</th><th class="th-actions"></th></tr></thead>
        <tbody>${data
          .map(
            (d) => `<tr>
            <td data-label="${esc(r.singular)}"><div class="cell-main">
              ${r.thumb ? (d[r.thumb] ? `<img class="thumb ${r.round ? "round" : ""}" src="${esc(d[r.thumb])}" alt="" loading="lazy" />` : `<span class="thumb thumb-empty ${r.round ? "round" : ""}">${icon("image", 16)}</span>`) : `<span class="thumb thumb-icon">${icon(r.icon, 16)}</span>`}
              <div class="cell-text"><div class="cell-title">${esc(d[r.primary])}</div><div class="cell-sub">${esc(r.secondary(d))}</div></div>
            </div></td>
            ${r.columns.map((c) => `<td data-label="${esc(c.label)}" class="${c.wide ? "td-wide" : ""}">${c.render(d)}</td>`).join("")}
            <td data-label="Status">${publishedPill(d.isPublished)}</td>
            <td class="td-actions"><div class="row-actions">
              <button class="icon-btn" data-edit="${d._id}" title="Edit">${icon("edit", 16)}</button>
              <button class="icon-btn icon-btn-danger" data-del="${d._id}" title="Delete">${icon("trash", 16)}</button>
            </div></td>
          </tr>`
          )
          .join("")}</tbody></table></div>
        <div class="table-foot muted small">Showing ${data.length} ${data.length === 1 ? r.singular : r.label.toLowerCase()}</div>`;
    };

    content.onclick = async (e) => {
      const seg = e.target.closest("#pub-filter button");
      if (seg) {
        pub = seg.dataset.v;
        content.querySelectorAll("#pub-filter button").forEach((b) => b.classList.toggle("active", b === seg));
        return load();
      }
      const edit = e.target.closest("[data-edit]")?.dataset.edit;
      const del = e.target.closest("[data-del]")?.dataset.del;
      if (edit) {
        const doc = data.find((d) => d._id === edit);
        openForm(`Edit ${r.singular}`, doc[r.primary], r.fields, doc, async (body) => {
          await api(`/admin/${key}/${edit}`, { method: "PUT", body });
          toast(`${r.singular[0].toUpperCase() + r.singular.slice(1)} updated`);
          load();
        });
      } else if (del) {
        const doc = data.find((d) => d._id === del);
        if (!(await confirmDialog({ title: `Delete ${r.singular}?`, text: `“${truncate(doc[r.primary], 60)}” will be permanently removed from the website.` }))) return;
        try {
          await api(`/admin/${key}/${del}`, { method: "DELETE" });
          toast(`${r.singular[0].toUpperCase() + r.singular.slice(1)} deleted`);
          load();
        } catch (ex) {
          toast(ex.message, "err");
        }
      }
    };
    $("#add-btn").addEventListener("click", () =>
      openForm(`Add ${r.singular}`, "Fill in the details below", r.fields, {}, async (body) => {
        await api(`/admin/${key}`, { method: "POST", body });
        toast(`${r.singular[0].toUpperCase() + r.singular.slice(1)} created`);
        load();
      })
    );
    $("#search").addEventListener("input", debounce(load));
    $("#cat-filter")?.addEventListener("change", load);
    await load();
  }

  /* ================= appointments ================= */
  const STATUSES = ["new", "contacted", "confirmed", "completed", "cancelled"];
  const STATUS_META = {
    new: { label: "New", cls: "pill-blue" },
    contacted: { label: "Contacted", cls: "pill-amber" },
    confirmed: { label: "Confirmed", cls: "pill-green" },
    completed: { label: "Completed", cls: "pill-teal" },
    cancelled: { label: "Cancelled", cls: "pill-red" },
  };
  const statusPill = (s) => pill(STATUS_META[s]?.label || s, STATUS_META[s]?.cls || "pill-gray");

  function appointmentDetail(x, onChange) {
    const wa = String(x.phone).replace(/[^\d]/g, "");
    drawer.open(
      "Appointment request",
      `Received ${fmtDate(x.createdAt, true)}`,
      `<div class="detail-hero">
        ${avatar(x.name, "avatar-lg")}
        <div><div class="detail-name">${esc(x.name)}</div><div class="muted small">${esc(x.treatment || "General Consultation")}</div></div>
      </div>
      <div class="quick-actions">
        <a class="btn btn-soft" href="tel:${esc(x.phone)}">${icon("phone", 16)} Call</a>
        <a class="btn btn-soft" href="https://wa.me/${esc(wa.length === 10 ? "91" + wa : wa)}" target="_blank" rel="noopener">${icon("whatsapp", 16)} WhatsApp</a>
        ${x.email ? `<a class="btn btn-soft" href="mailto:${esc(x.email)}">${icon("mail", 16)} Email</a>` : ""}
      </div>
      <div class="form-section">
        <h4 class="form-section-title">Status</h4>
        <div class="status-picker" id="status-picker">
          ${STATUSES.map((s) => `<button type="button" data-s="${s}" class="${s === x.status ? "active" : ""} ${STATUS_META[s].cls}"><i></i>${STATUS_META[s].label}</button>`).join("")}
        </div>
      </div>
      <div class="form-section">
        <h4 class="form-section-title">Request details</h4>
        <dl class="detail-list">
          <div><dt>Phone</dt><dd>${esc(x.phone)}</dd></div>
          <div><dt>Email</dt><dd>${esc(x.email || "—")}</dd></div>
          <div><dt>Treatment</dt><dd>${esc(x.treatment || "General Consultation")}</dd></div>
          <div><dt>Preferred date</dt><dd>${fmtDate(x.preferredDate)}</dd></div>
          <div class="full"><dt>Message</dt><dd>${esc(x.message || "—")}</dd></div>
        </dl>
      </div>
      <form class="form-section" id="notes-form">
        <h4 class="form-section-title">Internal notes</h4>
        <textarea name="notes" rows="4" placeholder="Visible only to the admin team">${esc(x.notes)}</textarea>
        <div class="drawer-foot"><button type="button" class="btn btn-ghost" data-close>Close</button><button class="btn btn-primary">${icon("check", 16)} Save notes</button></div>
      </form>`,
      { ico: "calendar" }
    );
    $("#status-picker").addEventListener("click", async (e) => {
      const b = e.target.closest("[data-s]");
      if (!b || b.classList.contains("active")) return;
      try {
        await api(`/admin/appointments/${x._id}`, { method: "PUT", body: { status: b.dataset.s } });
        x.status = b.dataset.s;
        $("#status-picker").querySelectorAll("button").forEach((el) => el.classList.toggle("active", el === b));
        toast(`Marked as ${STATUS_META[x.status].label.toLowerCase()}`);
        onChange();
      } catch (ex) {
        toast(ex.message, "err");
      }
    });
    $("#notes-form").addEventListener("submit", async (ev) => {
      ev.preventDefault();
      try {
        await api(`/admin/appointments/${x._id}`, { method: "PUT", body: { notes: ev.target.elements.notes.value } });
        toast("Notes saved");
        drawer.close();
        onChange();
      } catch (ex) {
        toast(ex.message, "err");
      }
    });
  }

  async function renderAppointments() {
    setHead("Appointments", "Consultation requests submitted through the website.", `<button class="btn btn-soft" id="export-btn" title="Download the requests matching the current tab and search">${icon("download", 16)} Export CSV</button>`);
    content.innerHTML = `
      <div class="status-tabs" id="status-tabs"></div>
      <div class="card table-card">
        <div class="toolbar">
          <div class="search-box">${icon("search", 16)}<input id="search" placeholder="Search by name, phone, email or treatment…" /></div>
        </div>
        <div id="table-area">${skeleton(6).replace('<div class="card">', "<div>")}</div>
      </div>`;

    let status = "";
    let page = 1;
    let data = [];

    const loadCounts = async () => {
      const { data: d } = await api("/admin/dashboard");
      const a = d.appointments;
      $("#status-tabs").innerHTML = [["", "All", a.total || 0], ...STATUSES.map((s) => [s, STATUS_META[s].label, a[s] || 0])]
        .map(([v, l, n]) => `<button data-status="${v}" class="${v === status ? "active" : ""}">${esc(l)} <span>${n}</span></button>`)
        .join("");
    };

    const load = async () => {
      const q = $("#search").value.trim();
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (status) params.set("status", status);
      if (q) params.set("q", q);
      const res = await api(`/admin/appointments?${params}`);
      data = res.data;
      const { pagination } = res;
      const area = $("#table-area");
      if (!data.length) {
        area.innerHTML = emptyState("inbox", "No appointment requests", q || status ? "Nothing matches this filter." : "Requests from the website's booking form will appear here.");
        return;
      }
      area.innerHTML = `<div class="table-scroll"><table class="table table-click">
        <thead><tr><th>Patient</th><th>Treatment</th><th>Preferred date</th><th>Received</th><th>Status</th><th class="th-actions"></th></tr></thead>
        <tbody>${data
          .map(
            (x) => `<tr data-view="${x._id}">
            <td data-label="Patient"><div class="cell-main">${avatar(x.name)}<div class="cell-text"><div class="cell-title">${esc(x.name)}</div><div class="cell-sub">${esc(x.phone)}${x.email ? ` · ${esc(x.email)}` : ""}</div></div></div></td>
            <td data-label="Treatment">${esc(x.treatment || "General Consultation")}</td>
            <td data-label="Preferred date">${fmtDate(x.preferredDate)}</td>
            <td data-label="Received"><span title="${esc(fmtDate(x.createdAt, true))}">${timeAgo(x.createdAt)}</span></td>
            <td data-label="Status">${statusPill(x.status)}</td>
            <td class="td-actions"><div class="row-actions">
              <a class="icon-btn" href="tel:${esc(x.phone)}" title="Call" data-stop>${icon("phone", 16)}</a>
              <button class="icon-btn" data-view="${x._id}" title="Open">${icon("eye", 16)}</button>
              <button class="icon-btn icon-btn-danger" data-del="${x._id}" title="Delete">${icon("trash", 16)}</button>
            </div></td>
          </tr>`
          )
          .join("")}</tbody></table></div>
        <div class="table-foot">
          <span class="muted small">${pagination.total} request${pagination.total === 1 ? "" : "s"}</span>
          ${
            pagination.pages > 1
              ? `<div class="pager"><button class="btn btn-ghost btn-sm" data-page="${page - 1}" ${page <= 1 ? "disabled" : ""}>← Prev</button><span class="small">Page ${page} of ${pagination.pages}</span><button class="btn btn-ghost btn-sm" data-page="${page + 1}" ${page >= pagination.pages ? "disabled" : ""}>Next →</button></div>`
              : ""
          }
        </div>`;
    };

    const refresh = () => Promise.all([load(), loadCounts()]);

    // Downloads every request matching the current tab + search (not just the visible page)
    $("#export-btn").addEventListener("click", async (e) => {
      const btn = e.currentTarget;
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      const q = $("#search").value.trim();
      if (q) params.set("q", q);
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Preparing…';
      try {
        const res = await fetch(`/api/admin/appointments/export?${params}`, { credentials: "same-origin" });
        if (res.status === 401) return (location.href = "/admin/login?expired=1");
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || `Export failed (${res.status})`);
        const name = /filename="([^"]+)"/.exec(res.headers.get("Content-Disposition") || "")?.[1] || "appointments.csv";
        const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(await res.blob()), download: name });
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        toast(`Downloaded ${name}`);
      } catch (ex) {
        toast(ex.message, "err");
      } finally {
        btn.disabled = false;
        btn.innerHTML = `${icon("download", 16)} Export CSV`;
      }
    });

    content.onclick = async (e) => {
      const tab = e.target.closest("#status-tabs [data-status]");
      if (tab) {
        status = tab.dataset.status;
        page = 1;
        content.querySelectorAll("#status-tabs button").forEach((b) => b.classList.toggle("active", b === tab));
        return load();
      }
      if (e.target.closest("[data-stop]")) return;
      const p = e.target.closest("[data-page]")?.dataset.page;
      if (p) {
        page = Number(p);
        return load();
      }
      const del = e.target.closest("[data-del]")?.dataset.del;
      if (del) {
        const x = data.find((d) => d._id === del);
        if (!(await confirmDialog({ title: "Delete appointment?", text: `The request from ${x.name} will be permanently deleted.` }))) return;
        await api(`/admin/appointments/${del}`, { method: "DELETE" });
        toast("Appointment deleted");
        return refresh();
      }
      const view = e.target.closest("[data-view]")?.dataset.view;
      if (view) appointmentDetail(data.find((d) => d._id === view), refresh);
    };
    $("#search").addEventListener("input", debounce(() => ((page = 1), load())));
    await refresh();
  }

  /* ================= dashboard ================= */
  async function renderDashboard() {
    const canLeads = me.role !== "editor";
    const hour = new Date().getHours();
    const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    setHead(`${greet}, ${me.name.split(" ")[0]}`, new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
    content.innerHTML = `<div class="kpis">${Array.from({ length: 4 }, () => '<div class="kpi"><span class="sk sk-line"></span><span class="sk sk-big"></span></div>').join("")}</div>`;

    const { data } = await api("/admin/dashboard");
    const a = data.appointments;
    const total = a.total || 0;
    const kpis = canLeads
      ? [
          ["New requests", a.new || 0, "Waiting for a call back", "calendar", "kpi-blue", "#appointments"],
          ["Confirmed", a.confirmed || 0, "Upcoming consultations", "check", "kpi-green", "#appointments"],
          ["All requests", total, `${a.completed || 0} completed`, "inbox", "kpi-amber", "#appointments"],
          ["Contacted", a.contacted || 0, "Awaiting confirmation", "phone", "kpi-violet", "#appointments"],
        ]
      : [
          ["Treatments", data.treatments, "Procedures listed", "stethoscope", "kpi-green", "#treatments"],
          ["Blog posts", data.blogs, "Articles published", "book", "kpi-blue", "#blogs"],
          ["Testimonials", data.testimonials, "Patient stories", "quote", "kpi-amber", "#testimonials"],
          ["FAQs", data.faqs, "Questions answered", "help", "kpi-violet", "#faqs"],
        ];

    const contentRows = [
      ["Treatments", data.treatments, "stethoscope", "#treatments"],
      ["Blog posts", data.blogs, "book", "#blogs"],
      ["Testimonials", data.testimonials, "quote", "#testimonials"],
      ["FAQs", data.faqs, "help", "#faqs"],
    ];

    const pipeline = STATUSES.map((s) => ({ s, n: a[s] || 0 }));
    const recent = data.recentAppointments || [];

    content.innerHTML = `
      <div class="kpis">${kpis
        .map(
          ([label, value, sub, ico, cls, href]) => `<a class="kpi ${cls}" href="${href}">
          <div class="kpi-top"><span class="kpi-label">${esc(label)}</span><span class="kpi-icon">${icon(ico, 18)}</span></div>
          <div class="kpi-value">${value}</div>
          <div class="kpi-sub">${esc(sub)}</div>
        </a>`
        )
        .join("")}</div>

      <div class="dash-grid">
        ${
          canLeads
            ? `<div class="card dash-recent">
          <div class="card-head"><div><h2>Recent requests</h2><p class="muted small">Latest consultation requests from the website</p></div><a class="btn btn-ghost btn-sm" href="#appointments">View all</a></div>
          ${
            recent.length
              ? `<ul class="activity">${recent
                  .map(
                    (x) => `<li data-view="${x._id}">
                ${avatar(x.name)}
                <div class="activity-main"><div class="cell-title">${esc(x.name)}</div><div class="cell-sub">${esc(x.treatment || "General Consultation")} · ${esc(x.phone)}</div></div>
                <div class="activity-meta">${statusPill(x.status)}<span class="muted small">${timeAgo(x.createdAt)}</span></div>
              </li>`
                  )
                  .join("")}</ul>`
              : emptyState("inbox", "No requests yet", "When patients book through the website, they'll show up here.")
          }
        </div>
        <div class="card">
          <div class="card-head"><div><h2>Request pipeline</h2><p class="muted small">Where every request currently stands</p></div></div>
          <div class="pipeline-bar">${total ? pipeline.filter((p) => p.n).map((p) => `<span class="seg seg-${p.s}" style="flex:${p.n}" title="${STATUS_META[p.s].label}: ${p.n}"></span>`).join("") : '<span class="seg seg-empty" style="flex:1"></span>'}</div>
          <ul class="pipeline">${pipeline
            .map((p) => `<li><span class="dot dot-${p.s}"></span><span>${STATUS_META[p.s].label}</span><b>${p.n}</b><span class="muted small">${total ? Math.round((p.n / total) * 100) : 0}%</span></li>`)
            .join("")}</ul>
        </div>`
            : ""
        }
        <div class="card">
          <div class="card-head"><div><h2>Website content</h2><p class="muted small">Everything currently managed here</p></div></div>
          <ul class="content-list">${contentRows
            .map(([l, n, ico, href]) => `<li><a href="${href}"><span class="thumb thumb-icon">${icon(ico, 16)}</span><span>${esc(l)}</span><b>${n}</b>${icon("chevron", 14, "rot")}</a></li>`)
            .join("")}</ul>
        </div>
        <div class="card quick-card">
          <div class="card-head"><div><h2>Quick actions</h2><p class="muted small">Common tasks</p></div></div>
          <div class="quick-grid">
            <a href="#blogs" data-quick="blogs">${icon("book", 18)}<span>Write a blog post</span></a>
            <a href="#testimonials" data-quick="testimonials">${icon("quote", 18)}<span>Add a testimonial</span></a>
            <a href="#faqs" data-quick="faqs">${icon("help", 18)}<span>Add an FAQ</span></a>
            <a href="/" target="_blank" rel="noopener">${icon("external", 18)}<span>Open the website</span></a>
          </div>
        </div>
      </div>`;

    content.onclick = (e) => {
      const view = e.target.closest("[data-view]")?.dataset.view;
      if (view) appointmentDetail(recent.find((x) => x._id === view), renderDashboard);
      const quick = e.target.closest("[data-quick]")?.dataset.quick;
      if (quick) pendingAdd = quick;
    };
  }
  // A quick action navigates to a section and opens its "add" drawer
  let pendingAdd = null;

  /* ================= site settings ================= */
  async function renderSettings() {
    const canEdit = me.role !== "editor";
    setHead("Site Settings", "Contact details and homepage statistics shown across the website.");
    content.innerHTML = skeleton(4);
    const { data } = await api("/admin/settings");
    const c = data.contact || {};
    const dis = canEdit ? "" : "disabled";
    const contactFields = [
      ["phone", "Phone (displayed)", "+91 98765 43210", "phone"],
      ["phoneRaw", "Phone (for dialling)", "+919876543210", "phone"],
      ["whatsapp", "WhatsApp number", "919876543210", "whatsapp"],
      ["email", "Email address", "care@example.com", "mail"],
      ["hours", "Working hours", "Mon – Sat : 10 AM – 7 PM", "clock"],
      ["emergency", "Emergency line text", "24×7 Emergency Support", "shield"],
    ];
    content.innerHTML = `<form id="settings-form" class="settings">
      <div class="card">
        <div class="card-head"><div><h2>Contact details</h2><p class="muted small">Shown in the header, footer, contact page and call buttons</p></div></div>
        <div class="form-grid">
          ${contactFields.map(([k, l, ph, ico]) => `<label class="field"><span class="field-label">${l}</span><span class="input-icon">${icon(ico, 16)}<input name="${k}" value="${esc(c[k])}" placeholder="${esc(ph)}" ${dis} /></span></label>`).join("")}
          <label class="field full"><span class="field-label">Clinic address</span><textarea name="address" rows="2" ${dis}>${esc(c.address)}</textarea></label>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><div><h2>Homepage statistics</h2><p class="muted small">The animated counters on the home, about and results pages</p></div></div>
        <div class="stats-edit">
          ${(data.stats || [])
            .map(
              (s, i) => `<div class="stat-edit">
            <div class="stat-preview"><b>${esc(s.value)}${esc(s.suffix)}</b><span>${esc(s.label)}</span></div>
            <div class="stat-fields">
              <label class="field"><span class="field-label">Value</span><input type="number" name="stat-value-${i}" value="${esc(s.value)}" ${dis} /></label>
              <label class="field"><span class="field-label">Suffix</span><input name="stat-suffix-${i}" value="${esc(s.suffix)}" ${dis} /></label>
              <label class="field full"><span class="field-label">Label</span><input name="stat-label-${i}" value="${esc(s.label)}" ${dis} /></label>
            </div>
          </div>`
            )
            .join("")}
        </div>
      </div>
      ${canEdit ? `<div class="sticky-save"><span class="muted small">Changes appear on the website after saving.</span><button class="btn btn-primary">${icon("check", 16)} Save settings</button></div>` : `<div class="notice">Only admins can edit site settings.</div>`}
    </form>`;
    if (!canEdit) return;
    const form = $("#settings-form");
    form.addEventListener("input", (e) => {
      const m = e.target.name.match(/^stat-(value|suffix|label)-(\d+)$/);
      if (!m) return;
      const i = m[2];
      const box = e.target.closest(".stat-edit").querySelector(".stat-preview");
      box.innerHTML = `<b>${esc(form.elements[`stat-value-${i}`].value)}${esc(form.elements[`stat-suffix-${i}`].value)}</b><span>${esc(form.elements[`stat-label-${i}`].value)}</span>`;
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = form.elements;
      const contact = Object.fromEntries([...contactFields.map(([k]) => k), "address"].map((k) => [k, f[k].value.trim()]));
      const stats = (data.stats || []).map((_, i) => ({ value: Number(f[`stat-value-${i}`].value), suffix: f[`stat-suffix-${i}`].value, label: f[`stat-label-${i}`].value }));
      const btn = form.querySelector(".sticky-save .btn");
      btn.disabled = true;
      try {
        await api("/admin/settings", { method: "PUT", body: { contact, stats } });
        toast("Settings saved");
      } catch (ex) {
        toast(ex.message, "err");
      } finally {
        btn.disabled = false;
      }
    });
  }

  /* ================= admin users ================= */
  const ROLE_META = {
    superadmin: { cls: "pill-violet", text: "Full access, including managing admin users" },
    admin: { cls: "pill-blue", text: "Content, appointments and settings" },
    editor: { cls: "pill-gray", text: "Website content only" },
  };
  async function renderAdmins() {
    setHead("Admin Users", "People who can sign in to this admin panel.", `<button class="btn btn-primary" id="add-btn">${icon("plus", 16)} Add user</button>`);
    content.innerHTML = skeleton(3);
    const fields = (isEdit) => [
      { section: "Profile" },
      { name: "name", label: "Full name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { section: "Access" },
      { name: "role", label: "Role", type: "select", options: ["editor", "admin", "superadmin"], full: true },
      { name: "password", label: isEdit ? "New password" : "Password", type: "password", required: !isEdit, hint: isEdit ? "Leave blank to keep the current password" : "At least 8 characters", full: true },
      { name: "isActive", label: "Active", hint: "Disabled users cannot sign in", type: "toggle", default: true },
    ];
    let data = [];
    const load = async () => {
      ({ data } = await api("/admin/admins"));
      content.innerHTML = `
        <div class="card table-card"><div class="table-scroll"><table class="table">
          <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Last sign-in</th><th class="th-actions"></th></tr></thead>
          <tbody>${data
            .map(
              (u) => `<tr>
              <td data-label="User"><div class="cell-main">${avatar(u.name)}<div class="cell-text"><div class="cell-title">${esc(u.name)}${u._id === me._id ? ' <span class="you">You</span>' : ""}</div><div class="cell-sub">${esc(u.email)}</div></div></div></td>
              <td data-label="Role">${pill(u.role, ROLE_META[u.role]?.cls || "pill-gray")}</td>
              <td data-label="Status">${u.isActive ? pill("Active", "pill-green") : pill("Disabled", "pill-gray")}</td>
              <td data-label="Last sign-in">${u.lastLoginAt ? timeAgo(u.lastLoginAt) : "Never"}</td>
              <td class="td-actions"><div class="row-actions">
                <button class="icon-btn" data-edit="${u._id}" title="Edit">${icon("edit", 16)}</button>
                ${u._id !== me._id ? `<button class="icon-btn icon-btn-danger" data-del="${u._id}" title="Delete">${icon("trash", 16)}</button>` : ""}
              </div></td></tr>`
            )
            .join("")}</tbody></table></div></div>
        <div class="roles">${Object.entries(ROLE_META)
          .map(([r, m]) => `<div class="role-card">${pill(r, m.cls)}<p class="muted small">${esc(m.text)}</p></div>`)
          .join("")}</div>`;
    };
    content.onclick = async (e) => {
      const edit = e.target.closest("[data-edit]")?.dataset.edit;
      const del = e.target.closest("[data-del]")?.dataset.del;
      if (edit) {
        const u = data.find((x) => x._id === edit);
        openForm("Edit user", u.email, fields(true), u, async (body) => {
          await api(`/admin/admins/${edit}`, { method: "PUT", body });
          toast("User updated");
          load();
        });
      } else if (del) {
        const u = data.find((x) => x._id === del);
        if (!(await confirmDialog({ title: "Delete user?", text: `${u.name} (${u.email}) will lose access to the admin panel.` }))) return;
        try {
          await api(`/admin/admins/${del}`, { method: "DELETE" });
          toast("User deleted");
          load();
        } catch (ex) {
          toast(ex.message, "err");
        }
      }
    };
    $("#add-btn").addEventListener("click", () =>
      openForm("Add user", "Give someone access to the admin panel", fields(false), {}, async (body) => {
        await api("/admin/admins", { method: "POST", body });
        toast("User created");
        load();
      })
    );
    await load();
  }

  /* ================= my account ================= */
  function renderAccount() {
    setHead("My Account", "Your profile and password.");
    content.innerHTML = `<div class="account-grid">
      <div class="card profile-card">
        ${avatar(me.name, "avatar-xl")}
        <h2>${esc(me.name)}</h2>
        <p class="muted">${esc(me.email)}</p>
        ${pill(me.role, ROLE_META[me.role]?.cls || "pill-gray")}
        <dl class="detail-list compact">
          <div><dt>Last sign-in</dt><dd>${fmtDate(me.lastLoginAt, true)}</dd></div>
          <div><dt>Member since</dt><dd>${fmtDate(me.createdAt)}</dd></div>
        </dl>
      </div>
      <form class="card" id="pw-form">
        <div class="card-head"><div><h2>Change password</h2><p class="muted small">You'll stay signed in on this device. Other sessions will be signed out.</p></div></div>
        <div class="form-grid">
          <label class="field full"><span class="field-label">Current password</span><input type="password" name="currentPassword" autocomplete="current-password" /></label>
          <label class="field full"><span class="field-label">New password</span><input type="password" name="newPassword" autocomplete="new-password" /><div class="strength"><span id="strength-bar"></span></div><small class="muted" id="strength-text">At least 8 characters</small></label>
          <label class="field full"><span class="field-label">Confirm new password</span><input type="password" name="confirm" autocomplete="new-password" /></label>
        </div>
        <div class="notice notice-err" id="pw-error" hidden></div>
        <div class="form-actions"><button class="btn btn-primary">${icon("check", 16)} Update password</button></div>
      </form>
    </div>`;
    const form = $("#pw-form");
    form.elements.newPassword.addEventListener("input", (e) => {
      const v = e.target.value;
      const score = [v.length >= 8, /[A-Z]/.test(v) && /[a-z]/.test(v), /\d/.test(v), /[^A-Za-z0-9]/.test(v)].filter(Boolean).length;
      const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
      $("#strength-bar").style.width = `${v ? Math.max(score, 1) * 25 : 0}%`;
      $("#strength-bar").className = `s${score}`;
      $("#strength-text").textContent = v ? labels[v.length < 8 ? 0 : score] : "At least 8 characters";
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = form.elements;
      const err = $("#pw-error");
      const fail = (m) => Object.assign(err, { textContent: m, hidden: false });
      err.hidden = true;
      if (!f.currentPassword.value) return fail("Enter your current password.");
      if (f.newPassword.value.length < 8) return fail("New password must be at least 8 characters.");
      if (f.newPassword.value !== f.confirm.value) return fail("The new passwords don't match.");
      try {
        await api("/auth/change-password", { method: "PUT", body: { currentPassword: f.currentPassword.value, newPassword: f.newPassword.value } });
        form.reset();
        $("#strength-bar").style.width = "0";
        toast("Password updated");
      } catch (ex) {
        fail(ex.message);
      }
    });
  }

  /* ================= navigation ================= */
  const ROUTES = {
    dashboard: { label: "Dashboard", icon: "dashboard", group: "Overview", render: renderDashboard },
    appointments: { label: "Appointments", icon: "calendar", group: "Patients", render: renderAppointments, roles: ["superadmin", "admin"], badge: true },
    treatments: { label: "Treatments", icon: "stethoscope", group: "Website content", render: () => renderResource("treatments") },
    blogs: { label: "Blog Posts", icon: "book", group: "Website content", render: () => renderResource("blogs") },
    testimonials: { label: "Testimonials", icon: "quote", group: "Website content", render: () => renderResource("testimonials") },
    faqs: { label: "FAQs", icon: "help", group: "Website content", render: () => renderResource("faqs") },
    settings: { label: "Site Settings", icon: "settings", group: "Administration", render: renderSettings },
    admins: { label: "Admin Users", icon: "users", group: "Administration", render: renderAdmins, roles: ["superadmin"] },
    account: { label: "My Account", icon: "user", group: "Administration", render: renderAccount, hidden: true },
  };
  const allowed = (r) => !r.roles || r.roles.includes(me.role);

  function buildNav() {
    const groups = {};
    for (const [k, r] of Object.entries(ROUTES)) {
      if (!allowed(r) || r.hidden) continue;
      (groups[r.group] ||= []).push([k, r]);
    }
    $("#nav").innerHTML = Object.entries(groups)
      .map(
        ([g, items]) => `<div class="nav-group"><div class="nav-group-label">${esc(g)}</div>${items
          .map(([k, r]) => `<a class="nav-link" href="#${k}" data-key="${k}" title="${esc(r.label)}">${icon(r.icon, 18)}<span class="nav-text">${esc(r.label)}</span>${r.badge ? '<span class="nav-badge" id="nav-badge-' + k + '" hidden></span>' : ""}</a>`)
          .join("")}</div>`
      )
      .join("");
  }

  async function updateBadge() {
    if (!allowed(ROUTES.appointments)) return;
    try {
      const { data } = await api("/admin/dashboard");
      const n = data.appointments.new || 0;
      const b = $("#nav-badge-appointments");
      if (b) {
        b.textContent = n;
        b.hidden = !n;
      }
    } catch {
      /* ignore */
    }
  }

  async function route() {
    let key = location.hash.slice(1) || "dashboard";
    if (!ROUTES[key] || !allowed(ROUTES[key])) key = "dashboard";
    const r = ROUTES[key];
    document.querySelectorAll("#nav .nav-link").forEach((a) => a.classList.toggle("active", a.dataset.key === key));
    $("#crumbs").innerHTML = `<span class="muted">${esc(r.group)}</span>${icon("chevron", 14, "rot")}<b>${esc(r.label)}</b>`;
    document.title = `${r.label} · Dr. Mehul Vikani Admin`;
    closeSidebar();
    closeProfile();
    if (!$("#drawer").hidden) drawer.close();
    content.onclick = content.onchange = null;
    content.classList.remove("page-enter");
    void content.offsetWidth;
    content.classList.add("page-enter");
    try {
      await r.render();
      if (pendingAdd === key) $("#add-btn")?.click();
    } catch (ex) {
      content.innerHTML = `<div class="card">${emptyState("alert", "Something went wrong", ex.message)}</div>`;
    } finally {
      pendingAdd = null;
    }
    updateBadge();
  }

  /* ================= sidebar, profile, logout ================= */
  const layout = $("#layout");
  const closeSidebar = () => layout.classList.remove("sidebar-open");
  const closeProfile = () => {
    $("#profile-menu").hidden = true;
    $("#profile-btn").setAttribute("aria-expanded", "false");
  };

  async function logout() {
    if (!(await confirmDialog({ title: "Log out?", text: "You'll need to sign in again to access the admin panel.", okLabel: "Log out", ico: "logout" }))) return;
    try {
      await api("/auth/logout", { method: "POST" });
    } finally {
      location.href = "/admin/login?logged_out=1";
    }
  }

  async function init() {
    try {
      ({ admin: me } = await api("/auth/me"));
    } catch {
      return;
    }
    buildNav();
    $("#menu-btn").innerHTML = icon("menu", 20);
    $("#view-site").innerHTML = `${icon("external", 15)}<span>View website</span>`;
    $("#user-card").innerHTML = `${avatar(me.name)}<div class="user-meta"><div class="user-name">${esc(me.name)}</div><div class="user-role">${esc(me.role)}</div></div>`;
    $("#logout-btn").innerHTML = `${icon("logout", 18)}<span class="nav-text">Log out</span>`;
    $("#profile-btn").innerHTML = `${avatar(me.name, "avatar-sm")}<span class="profile-name">${esc(me.name)}</span>${icon("chevron", 14)}`;
    $("#profile-menu").innerHTML = `
      <div class="profile-menu-head">${avatar(me.name)}<div><div class="cell-title">${esc(me.name)}</div><div class="cell-sub">${esc(me.email)}</div></div></div>
      <a href="#account">${icon("user", 16)} My account</a>
      ${me.role !== "editor" ? `<a href="#settings">${icon("settings", 16)} Site settings</a>` : ""}
      <button data-logout>${icon("logout", 16)} Log out</button>`;

    if (store.get("admin-sidebar") === "collapsed") layout.classList.add("collapsed");

    $("#menu-btn").addEventListener("click", () => {
      if (window.matchMedia("(max-width: 960px)").matches) layout.classList.toggle("sidebar-open");
      else {
        layout.classList.toggle("collapsed");
        store.set("admin-sidebar", layout.classList.contains("collapsed") ? "collapsed" : "open");
      }
    });
    $("#sidebar-backdrop").addEventListener("click", closeSidebar);
    $("#logout-btn").addEventListener("click", logout);
    $("#profile-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      const m = $("#profile-menu");
      m.hidden = !m.hidden;
      $("#profile-btn").setAttribute("aria-expanded", String(!m.hidden));
    });
    $("#profile-menu").addEventListener("click", (e) => {
      if (e.target.closest("[data-logout]")) logout();
      closeProfile();
    });
    document.addEventListener("click", (e) => !e.target.closest("#profile") && closeProfile());

    $("#boot").remove();
    layout.hidden = false;
    window.addEventListener("hashchange", route);
    route();
    setInterval(updateBadge, 60000);
  }

  init();
})();
