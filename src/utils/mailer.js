const nodemailer = require("nodemailer");
const env = require("../config/env");

const { smtp } = env;
const enabled = !!(smtp.host && smtp.user && smtp.pass && smtp.to);

const transporter = enabled
  ? nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465, // 465 = implicit TLS, 587 = STARTTLS
      auth: { user: smtp.user, pass: smtp.pass },
    })
  : null;

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const istDate = (d, withTime) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
        ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
      })
    : "";

// Emails the clinic inbox about a new appointment / contact-form request.
// Never throws: a mail failure must not fail the patient's form submission.
async function notifyNewAppointment(a) {
  if (!enabled) return;
  const rows = [
    ["Name", a.name],
    ["Phone", a.phone],
    ["Email", a.email],
    ["Treatment", a.treatment || "General Consultation"],
    ["Preferred date", istDate(a.preferredDate)],
    ["Message", a.message],
    ["Received", istDate(a.createdAt, true)],
  ].filter(([, v]) => v);

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e3ebe6;border-radius:12px;overflow:hidden">
    <div style="background:#2b8c57;color:#fff;padding:18px 22px;font-size:18px;font-weight:bold">New appointment request</div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${rows
        .map(
          ([k, v]) => `<tr>
        <td style="padding:10px 22px;color:#5b6b63;width:130px;vertical-align:top;border-bottom:1px solid #eef3f0">${esc(k)}</td>
        <td style="padding:10px 22px;color:#13221a;border-bottom:1px solid #eef3f0;white-space:pre-wrap">${esc(v)}</td>
      </tr>`
        )
        .join("")}
    </table>
    <div style="padding:14px 22px;color:#8a978f;font-size:12px">Sent from the website. Reply to this email to answer the patient${a.email ? "" : " (no email given, please call them)"}.</div>
  </div>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  try {
    await transporter.sendMail({
      from: { name: smtp.fromName, address: smtp.user },
      to: smtp.to,
      replyTo: a.email ? { name: a.name, address: a.email } : undefined,
      subject: `New appointment request: ${a.name} (${a.treatment || "General Consultation"})`,
      text,
      html,
    });
  } catch (err) {
    console.error("Appointment email failed:", err.message);
  }
}

module.exports = { notifyNewAppointment, mailEnabled: enabled, transporter };
