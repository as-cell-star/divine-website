import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";

const ORIGIN = { ...process.env };

before(() => {
  process.env.CLOUDINARY_CLOUD_NAME = "divinebirth";
  process.env.CLOUDINARY_API_KEY = "224466";
  process.env.CLOUDINARY_API_SECRET = "test-secret";
  process.env.CLOUDINARY_BOOKINGS_FOLDER = "divine-birth/bookings";
  process.env.FRONTEND_URL = "https://www.divinebirthmidwiferycenter.com";
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;
  delete process.env.RESEND_API_KEY;
});

after(() => {
  for (const key of Object.keys(process.env)) {
    if (!(key in ORIGIN)) delete process.env[key];
  }
  Object.assign(process.env, ORIGIN);
});

describe("dispatchClinicPipeline", () => {
  it("uploads to Cloudinary then emails the clinic inboxes", async () => {
    const hits: string[] = [];
    const prev = globalThis.fetch;
    globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      hits.push(url);
      if (url.includes("api.cloudinary.com")) {
        const body = String(init?.body ?? "");
        assert.match(body, /notification_url=/);
        assert.match(decodeURIComponent(body), /api\/webhooks\/cloudinary/);
        return new Response(
          JSON.stringify({
            public_id: "divine-birth/bookings/appointment-p1",
            secure_url: "https://res.cloudinary.com/divinebirth/image/upload/p1.png",
          }),
          { status: 200 },
        );
      }
      if (url.includes("formsubmit.co")) {
        return new Response(JSON.stringify({ success: "true" }), { status: 200 });
      }
      return new Response("unexpected", { status: 500 });
    }) as typeof fetch;

    try {
      const { dispatchClinicPipeline } = await import("./pipeline.ts");
      const result = await dispatchClinicPipeline({
        kind: "appointment",
        id: "p1",
        firstName: "Amina",
        lastName: "Otieno",
        phone: "0794444121",
        service: "Postnatal Clinic",
        date: "2026-09-22",
        time: "11:00",
        notes: "first visit",
      });
      assert.equal(result.emailStatus, "sent");
      assert.equal(result.cloudinaryUrl, "https://res.cloudinary.com/divinebirth/image/upload/p1.png");
      assert.match(result.detail, /Cloudinary/i);
      assert.ok(hits.some((u) => u.includes("api.cloudinary.com")));
      assert.ok(hits.some((u) => u.includes("formsubmit.co")));
    } finally {
      globalThis.fetch = prev;
    }
  });

  it("still emails if Cloudinary is down", async () => {
    const prev = globalThis.fetch;
    globalThis.fetch = (async (input: string | URL | Request) => {
      const url = String(input);
      if (url.includes("cloudinary")) return new Response("down", { status: 503 });
      if (url.includes("formsubmit.co")) {
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }
      return new Response("unexpected", { status: 500 });
    }) as typeof fetch;
    try {
      const { dispatchClinicPipeline } = await import("./pipeline.ts");
      const result = await dispatchClinicPipeline({
        kind: "inquiry",
        id: "q1",
        firstName: "Faith",
        lastName: "Mwangi",
        phone: "0700000000",
        service: "Antenatal Care",
        message: "When can I come in?",
      });
      assert.equal(result.cloudinaryUrl, null);
      assert.equal(result.emailStatus, "sent");
    } finally {
      globalThis.fetch = prev;
    }
  });
});
