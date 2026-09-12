import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function formatPhoneDisplay(phone: string) {
  return phone.replace(/\s+/g, " ").trim();
}

export function isKenyanPhone(phone: string) {
  const p = phone.replace(/[\s-]/g, "");
  return /^(\+254|0)[17]\d{8}$/.test(p) || /^\+\d{10,15}$/.test(p);
}

export function toE164(phone: string) {
  const p = phone.replace(/[\s-]/g, "");
  if (p.startsWith("+")) return p;
  if (p.startsWith("0")) return `+254${p.slice(1)}`;
  if (p.startsWith("254")) return `+${p}`;
  return p;
}

export function formatWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-KE", {
    timeZone: "Africa/Nairobi",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
