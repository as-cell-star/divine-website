import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { bookingCardDataUrl, bookingCardSvg } from "./card.ts";

const sample = {
  kind: "appointment" as const,
  id: "ref-1",
  firstName: "Grace",
  lastName: "Wanjiru",
  phone: "0794444141",
  service: "Birthing Services",
  date: "2026-09-20",
  time: "09:00",
  notes: "Twins <3 & \"home\"",
};

describe("booking card", () => {
  it("embeds the filled fields", () => {
    const svg = bookingCardSvg(sample);
    assert.match(svg, /Grace Wanjiru/);
    assert.match(svg, /0794444141/);
    assert.match(svg, /Birthing Services/);
    assert.match(svg, /2026-09-20 · 09:00/);
    assert.match(svg, /ref-1/);
  });

  it("escapes XML in notes so the SVG stays well-formed", () => {
    const svg = bookingCardSvg(sample);
    assert.equal(svg.includes("<3"), false);
    assert.ok(svg.includes("&" + "lt;3"));
    assert.ok(svg.includes("&" + "amp;"));
    assert.ok(svg.includes("&" + "quot;home" + "&" + "quot;"));
  });

  it("encodes as a data URL for Cloudinary", () => {
    const url = bookingCardDataUrl(sample);
    assert.ok(url.startsWith("data:image/svg+xml;base64,"));
    const xml = Buffer.from(url.split(",")[1]!, "base64").toString("utf8");
    assert.match(xml, /Divine Birth Midwifery Centre/);
  });
});
