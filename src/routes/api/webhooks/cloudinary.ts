import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { sendClinicEmail, smtpReady } from "@/lib/notify/mail.server";
import { sendViaFormsubmit } from "@/lib/notify/formsubmit.server";
import { verifyCloudinaryWebhook } from "@/lib/notify/cloudinary.server";
import type { BookingCardInput } from "@/lib/notify/card";

async function deliver(input: BookingCardInput, url?: string) {
  if (smtpReady()) {
    await sendClinicEmail(input, url);
    return;
  }
  await sendViaFormsubmit(input, url);
}

async function handle(request: Request) {
  const timestamp = request.headers.get("x-cld-timestamp") || "";
  const signature = request.headers.get("x-cld-signature") || "";
  const body = await request.text();
  if (timestamp && signature && !verifyCloudinaryWebhook(timestamp, signature, body)) {
    return new Response(JSON.stringify({ ok: false }), { status: 401 });
  }

  let payload: {
    public_id?: string;
    secure_url?: string;
    context?: { custom?: Record<string, string> };
  };
  try {
    payload = JSON.parse(body) as typeof payload;
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 400 });
  }

  const custom = payload.context?.custom ?? {};
  const ref = custom.ref;
  const url = payload.secure_url;
  if (!ref) return Response.json({ ok: true, skipped: true });

  const sql = await getSql();
  const appointments = await sql<{
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    service: string;
    date: string;
    time: string;
    notes: string;
    email_status: string;
  }>`select id, first_name, last_name, phone, service, date, time, notes, email_status from appointments where id = ${ref} limit 1`;

  const appointment = appointments[0];
  if (appointment && url) {
    await sql`update appointments set cloudinary_url = ${url} where id = ${appointment.id}`;
    if (appointment.email_status !== "sent") {
      try {
        await deliver(
          {
            kind: "appointment",
            id: appointment.id,
            firstName: appointment.first_name,
            lastName: appointment.last_name,
            phone: appointment.phone,
            service: appointment.service,
            date: appointment.date,
            time: appointment.time,
            notes: appointment.notes,
          },
          url,
        );
        await sql`update appointments set email_status = ${"sent"} where id = ${appointment.id}`;
      } catch {
        await sql`update appointments set email_status = ${"failed"} where id = ${appointment.id}`;
      }
    }
    return Response.json({ ok: true });
  }

  const inquiries = await sql<{
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    service: string;
    message: string;
    email_status: string;
  }>`select id, first_name, last_name, phone, service, message, email_status from inquiries where id = ${ref} limit 1`;
  const inquiry = inquiries[0];
  if (inquiry && url) {
    await sql`update inquiries set cloudinary_url = ${url} where id = ${inquiry.id}`;
    if (inquiry.email_status !== "sent") {
      try {
        await deliver(
          {
            kind: "inquiry",
            id: inquiry.id,
            firstName: inquiry.first_name,
            lastName: inquiry.last_name,
            phone: inquiry.phone,
            service: inquiry.service || "General",
            message: inquiry.message,
          },
          url,
        );
        await sql`update inquiries set email_status = ${"sent"} where id = ${inquiry.id}`;
      } catch {
        await sql`update inquiries set email_status = ${"failed"} where id = ${inquiry.id}`;
      }
    }
  }

  return Response.json({ ok: true });
}

export const Route = createFileRoute("/api/webhooks/cloudinary")({
  server: {
    handlers: {
      POST: ({ request }) => handle(request),
    },
  },
});
