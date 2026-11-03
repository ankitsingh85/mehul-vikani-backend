(async () => {
  // Already logged in? go straight to the dashboard
  try {
    const res = await fetch("/api/auth/me", { credentials: "same-origin" });
    if (res.ok) return (window.location.href = "/admin");
  } catch {
    /* ignore */
  }

  const form = document.getElementById("login-form");
  const errBox = document.getElementById("login-error");
  const notice = document.getElementById("login-notice");
  const btn = document.getElementById("login-btn");
  const pw = form.elements.password;

  const params = new URLSearchParams(location.search);
  if (params.has("logged_out")) {
    notice.textContent = "You have been logged out.";
    notice.hidden = false;
  } else if (params.has("expired")) {
    notice.textContent = "Your session expired. Please sign in again.";
    notice.hidden = false;
  }

  document.getElementById("pw-toggle").addEventListener("click", (e) => {
    pw.type = pw.type === "password" ? "text" : "password";
    e.target.textContent = pw.type === "password" ? "Show" : "Hide";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errBox.hidden = true;
    notice.hidden = true;
    const email = form.elements.email.value.trim();
    const password = pw.value;
    if (!email || !password) {
      errBox.textContent = "Please enter your email and password.";
      errBox.hidden = false;
      return;
    }
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Signing in…';
    try {
      await api("/auth/login", { method: "POST", body: { email, password } });
      window.location.href = "/admin";
    } catch (err) {
      errBox.textContent = err.message;
      errBox.hidden = false;
      btn.disabled = false;
      btn.textContent = "Sign in";
    }
  });
})();
