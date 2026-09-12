import nodemailer from "nodemailer";
import { env } from "@/lib/env.server";
import { CLINIC } from "@/lib/cms/defaults";
import type { BookingCardInput } from "./card";
import { escapeHtml } from "./escape";

export const CLINIC_INBOX = [env("NOTIFY_EMAIL") || CLINIC.emailPrimary, CLINIC.emailSecondary].filter(
  (v, i, a) => v && a.indexOf(v) === i,
);

export function smtpReady() {
  return Boolean(env("RESEND_API_KEY") || (env("SMTP_HOST") && env("SMTP_USER") && env("SMTP_PASS")));
}

export function emailReady() {
  return smtpReady();
}

function htmlEmail(input: BookingCardInput, cardUrl?: string) {
  const when = [input.date, input.time].filter(Boolean).join(" · ") || "—";
  const extra = input.notes || input.message || "—";
  const kind = input.kind === "appointment" ? "Appointment request" : "Website inquiry";
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 0;color:#8a7a84;width:34%">${label}</td><td>${escapeHtml(value)}</td></tr>`;
  return `<!DOCTYPE html>
<html><body style="margin:0;background:#faf8f5;font-family:Georgia,serif;color:#2a1f27">
  <div style="max-width:640px;margin:32px auto;background:#fff;border:1px solid #e2d6db">
    <div style="background:#3e1f33;padding:28px 32px;color:#fff">
      <h1 style="margin:0;font-weight:400;font-size:22px">Divine Birth Midwifery Centre</h1>
      <p style="margin:8px 0 0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.7">${kind}</p>
    </div>
    <div style="padding:32px">
      <p>A new ${input.kind} arrived from the website.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0">
        ${row("Name", `${input.firstName} ${input.lastName}`)}
        ${row("Phone", input.phone)}
        ${row("Service", input.service)}
        ${row("When", when)}
        ${row("Notes", extra)}
        ${row("Ref", input.id)}
      </table>
      ${
        cardUrl
          ? `<p><a href="${escapeHtml(cardUrl)}" style="color:#0f7a6e">Open the Cloudinary booking card</a></p><p><img src="${escapeHtml(cardUrl)}" alt="Booking card" style="max-width:100%;border:1px solid #e2d6db"/></p>`
          : ""
      }
      <p style="font-size:13px;color:#5a4b55">Please confirm with the family by SMS or phone.</p>
    </div>
  </div>
</body></html>`;
}

export async function sendClinicEmail(input: BookingCardInput, cardUrl?: string) {
  if (!smtpReady()) return { sent: false as const, reason: "SMTP is not configured." };

  const kind = input.kind === "appointment" ? "Appointment" : "Inquiry";
  const subject = `${kind}: ${input.firstName} ${input.lastName} · ${input.service}`;
  const html = htmlEmail(input, cardUrl);
  const text = `${kind} from ${input.firstName} ${input.lastName}\nPhone: ${input.phone}\nService: ${input.service}\nWhen: ${[input.date, input.time].filter(Boolean).join(" ")}\n${input.notes || input.message || ""}\nCard: ${cardUrl || "n/a"}`;

  if (env("RESEND_API_KEY")) {
    const from = env("MAIL_FROM") || env("SMTP_USER") || "Divine Birth <onboarding@resend.dev>";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: CLINIC_INBOX, subject, html, text }),
    });
    if (!res.ok) throw new Error(`Resend failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
    return { sent: true as const };
  }

  const transporter = nodemailer.createTransport({
    host: env("SMTP_HOST") || "smtp.gmail.com",
    port: Number(env("SMTP_PORT") || 587),
    secure: env("SMTP_SECURE") === "true",
    auth: { user: env("SMTP_USER"), pass: env("SMTP_PASS") },
  });
  await transporter.sendMail({
    from: `"Divine Birth Midwifery Centre" <${env("SMTP_USER")}>`,
    to: CLINIC_INBOX.join(", "),
    subject,
    html,
    text,
  });
  return { sent: true as const };
}
