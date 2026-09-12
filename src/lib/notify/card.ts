import { escapeXml } from "./escape";

export type BookingCardInput = {
  kind: "appointment" | "inquiry";
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  service: string;
  date?: string;
  time?: string;
  notes?: string;
  message?: string;
};

export function bookingCardSvg(input: BookingCardInput) {
  const title = input.kind === "appointment" ? "New appointment" : "New inquiry";
  const when = [input.date, input.time].filter(Boolean).join(" · ") || "—";
  const extra = (input.notes || input.message || "—").slice(0, 110);
  const name = `${input.firstName} ${input.lastName}`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#2c1524"/>
  <rect x="48" y="48" width="1104" height="534" fill="#faf8f5"/>
  <rect x="48" y="48" width="8" height="534" fill="#c8963a"/>
  <text x="88" y="110" font-family="Georgia, serif" font-size="18" letter-spacing="4" fill="#0f7a6e">${escapeXml(title.toUpperCase())}</text>
  <text x="88" y="168" font-family="Georgia, serif" font-size="42" fill="#3e1f33">Divine Birth Midwifery Centre</text>
  <text x="88" y="208" font-family="Georgia, serif" font-size="20" fill="#5a4b55">Kahawa Wendani · Nairobi · Open 24 / 7</text>
  <text x="88" y="292" font-family="Georgia, serif" font-size="34" fill="#2a1f27">${escapeXml(name)}</text>
  <text x="88" y="348" font-family="Georgia, serif" font-size="20" fill="#5a4b55">Phone    ${escapeXml(input.phone)}</text>
  <text x="88" y="384" font-family="Georgia, serif" font-size="20" fill="#5a4b55">Service  ${escapeXml(input.service)}</text>
  <text x="88" y="420" font-family="Georgia, serif" font-size="20" fill="#5a4b55">When     ${escapeXml(when)}</text>
  <text x="88" y="478" font-family="Georgia, serif" font-size="18" fill="#8a7a84">${escapeXml(extra)}</text>
  <text x="88" y="540" font-family="Georgia, serif" font-size="14" fill="#8a7a84">Ref ${escapeXml(input.id)}</text>
</svg>`;
}

export function bookingCardDataUrl(input: BookingCardInput) {
  return `data:image/svg+xml;base64,${Buffer.from(bookingCardSvg(input)).toString("base64")}`;
}

/** 1×1 GIF — Smartech-style Cloudinary record when the SVG card is rejected. */
export const PIXEL_GIF =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
