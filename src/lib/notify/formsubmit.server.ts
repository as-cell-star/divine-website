import { CLINIC } from "@/lib/cms/defaults";
import { env } from "@/lib/env.server";
import type { BookingCardInput } from "./card";

const INBOXES = [CLINIC.emailPrimary, CLINIC.emailSecondary];
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function origin() {
  const raw = (env("FRONTEND_URL") || env("BETTER_AUTH_URL") || "https://divinebirthmidwifery.org").replace(/\/$/, "");
  if (raw.includes("localhost") || raw.includes("127.0.0.1")) return "https://divinebirthmidwifery.org";
  return raw;
}

function fields(input: BookingCardInput, cardUrl?: string) {
  const kind = input.kind === "appointment" ? "Appointment request" : "Website inquiry";
  return {
    _subject: `${kind}: ${input.firstName} ${input.lastName} · ${input.service}`,
    _template: "table",
    _captcha: "false",
    Name: `${input.firstName} ${input.lastName}`,
    Phone: input.phone,
    Service: input.service,
    Date: input.date || "—",
    Time: input.time || "—",
    Notes: input.notes || input.message || "—",
    Reference: input.id,
    Cloudinary: cardUrl || "not uploaded",
    Clinic: CLINIC.name,
  };
}

function accepted(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("activate form") || lower.includes("activation")) return true;
  if (lower.includes('"success":"true"') || lower.includes('"success":true')) return true;
  if (lower.includes("form submitted") || lower.includes("email sent")) return true;
  return false;
}

async function postInbox(email: string, payload: Record<string, string>) {
  const from = origin();
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": BROWSER_UA,
      Origin: from,
      Referer: `${from}/`,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Clinic email failed (${res.status}): ${text.slice(0, 240)}`);
  if (!accepted(text) && /error|fail|false/i.test(text)) {
    throw new Error(text.slice(0, 240));
  }
  return text;
}

/** Delivers the filled booking to both Divine Birth inboxes without SMTP keys. */
export async function sendViaFormsubmit(input: BookingCardInput, cardUrl?: string) {
  const payload = fields(input, cardUrl);
  const results = await Promise.allSettled(INBOXES.map((email) => postInbox(email, payload)));
  const sent = results.filter((r) => r.status === "fulfilled").length;
  if (!sent) {
    const reason = results.find((r) => r.status === "rejected");
    throw new Error(reason && reason.status === "rejected" ? String(reason.reason) : "Could not reach the clinic inbox.");
  }
  return { sent: true as const, inboxes: sent };
}
