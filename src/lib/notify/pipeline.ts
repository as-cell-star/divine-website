import { env } from "@/lib/env.server";
import { bookingCardDataUrl, type BookingCardInput } from "./card";
import { cloudinaryReady, uploadBookingToCloudinary } from "./cloudinary.server";
import { sendViaFormsubmit } from "./formsubmit.server";
import { smtpReady, sendClinicEmail } from "./mail.server";

export type PipelineResult = {
  cloudinaryUrl: string | null;
  emailStatus: "sent" | "queued" | "failed";
  detail: string;
};

function notificationUrl() {
  const base = (env("FRONTEND_URL") || env("BETTER_AUTH_URL") || "").replace(/\/$/, "");
  if (!base || base.includes("localhost") || base.includes("127.0.0.1")) return undefined;
  return `${base}/api/webhooks/cloudinary`;
}

/**
 * The live pipeline, adapted from Smartech's Cloudinary-as-database trick
 * plus Divine Birth's original clinic-inbox mailer:
 *
 * 1. Postgres already holds the row.
 * 2. Render a booking card and upload it to Cloudinary with form fields
 *    stored as context metadata (folder: divine-birth/bookings).
 * 3. Cloudinary can POST to /api/webhooks/cloudinary on completion.
 * 4. Email both clinic inboxes — SMTP/Resend if configured, otherwise
 *    FormSubmit so the midwives still receive the filled request.
 */
export async function dispatchClinicPipeline(input: BookingCardInput): Promise<PipelineResult> {
  let cloudinaryUrl: string | null = null;
  let cloudinaryError: string | null = null;

  if (cloudinaryReady()) {
    try {
      const uploaded = await uploadBookingToCloudinary({
        publicId: `${input.kind}-${input.id}`,
        fileDataUrl: bookingCardDataUrl(input),
        notificationUrl: notificationUrl(),
        context: {
          kind: input.kind,
          name: `${input.firstName} ${input.lastName}`,
          phone: input.phone,
          service: input.service,
          date: input.date || "",
          time: input.time || "",
          notes: input.notes || input.message || "",
          ref: input.id,
          clinic: "Divine Birth Midwifery Centre",
        },
      });
      cloudinaryUrl = uploaded?.url ?? null;
    } catch (err) {
      cloudinaryError = err instanceof Error ? err.message : "Cloudinary upload failed.";
    }
  }

  if (smtpReady()) {
    try {
      await sendClinicEmail(input, cloudinaryUrl ?? undefined);
      return {
        cloudinaryUrl,
        emailStatus: "sent",
        detail: cloudinaryUrl
          ? "Saved to Cloudinary and emailed the midwives."
          : "Emailed the midwives.",
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Email failed.";
      try {
        await sendViaFormsubmit(input, cloudinaryUrl ?? undefined);
        return {
          cloudinaryUrl,
          emailStatus: "sent",
          detail: "Emailed the midwives (backup inbox).",
        };
      } catch {
        return { cloudinaryUrl, emailStatus: "failed", detail: message };
      }
    }
  }

  try {
    await sendViaFormsubmit(input, cloudinaryUrl ?? undefined);
    return {
      cloudinaryUrl,
      emailStatus: "sent",
      detail: cloudinaryUrl
        ? "Saved to Cloudinary and emailed info@divinebirthmidwifery.org."
        : "Emailed the midwives at Divine Birth.",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not email the clinic.";
    if (cloudinaryUrl) {
      return {
        cloudinaryUrl,
        emailStatus: "queued",
        detail: "Saved to Cloudinary. Email will retry from the Cloudinary webhook.",
      };
    }
    return {
      cloudinaryUrl: null,
      emailStatus: "failed",
      detail: cloudinaryError ? `${cloudinaryError} ${message}` : message,
    };
  }
}
