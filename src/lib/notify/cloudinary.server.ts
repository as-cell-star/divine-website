import { createHash } from "node:crypto";
import { env } from "@/lib/env.server";
import { PIXEL_GIF } from "./card";

export type CloudinaryUploadResult = {
  publicId: string;
  url: string;
};

function cloudName() {
  return env("CLOUDINARY_CLOUD_NAME");
}
function apiKey() {
  return env("CLOUDINARY_API_KEY");
}
function apiSecret() {
  return env("CLOUDINARY_API_SECRET");
}
function unsignedPreset() {
  return env("CLOUDINARY_UPLOAD_PRESET");
}

function sign(params: Record<string, string>) {
  const canonical = Object.keys(params)
    .filter((k) => params[k])
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1")
    .update(canonical + (apiSecret() ?? ""))
    .digest("hex");
}

function escapeContext(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(/=/g, "\\=").replace(/\n/g, " ").slice(0, 800);
}

export function cloudinaryReady() {
  return Boolean(cloudName() && ((apiKey() && apiSecret()) || unsignedPreset()));
}

export function verifyCloudinaryWebhook(timestamp: string, signature: string, body: string) {
  const secret = apiSecret();
  if (!secret) return false;
  const expected = createHash("sha1").update(body + timestamp + secret).digest("hex");
  return expected === signature;
}

function folder() {
  return env("CLOUDINARY_BOOKINGS_FOLDER") || "divine-birth/bookings";
}

async function postUpload(form: Record<string, string>) {
  const cloud = cloudName();
  if (!cloud) return null;
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: new URLSearchParams(form),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Cloudinary upload failed (${res.status}): ${text.slice(0, 400)}`);
  const json = JSON.parse(text) as { public_id: string; secure_url: string };
  return { publicId: json.public_id, url: json.secure_url };
}

function buildForm(opts: {
  publicId: string;
  fileDataUrl: string;
  context: Record<string, string>;
  notificationUrl?: string;
}) {
  const ts = String(Math.floor(Date.now() / 1000));
  const context = Object.entries(opts.context)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${escapeContext(v)}`)
    .join("|");
  const dest = folder();
  const form: Record<string, string> = {
    file: opts.fileDataUrl,
    folder: dest,
    overwrite: "true",
    public_id: opts.publicId,
  };
  if (context) form.context = context;
  if (opts.notificationUrl) form.notification_url = opts.notificationUrl;

  if (apiKey() && apiSecret()) {
    const params: Record<string, string> = {
      folder: dest,
      overwrite: "true",
      public_id: opts.publicId,
      timestamp: ts,
    };
    if (context) params.context = context;
    if (opts.notificationUrl) params.notification_url = opts.notificationUrl;
    form.api_key = apiKey()!;
    form.timestamp = ts;
    form.signature = sign(params);
    return form;
  }

  const preset = unsignedPreset();
  if (!preset) throw new Error("Cloudinary unsigned preset missing.");
  form.upload_preset = preset;
  return form;
}

/**
 * Smartech pattern: persist the filled booking as a Cloudinary asset
 * plus context metadata (name, phone, service, date). SVG card first;
 * 1×1 GIF + context if the account rejects SVG.
 */
export async function uploadBookingToCloudinary(opts: {
  publicId: string;
  fileDataUrl: string;
  context: Record<string, string>;
  notificationUrl?: string;
}): Promise<CloudinaryUploadResult | null> {
  if (!cloudinaryReady()) return null;
  try {
    return await postUpload(buildForm(opts));
  } catch (first) {
    try {
      return await postUpload(buildForm({ ...opts, fileDataUrl: PIXEL_GIF }));
    } catch {
      throw first;
    }
  }
}
