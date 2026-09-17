import { createHash } from "node:crypto";
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";

const ORIGIN = { ...process.env };
const calls: Array<{ url: string; body: string }> = [];

function sha1(value: string) {
  return createHash("sha1").update(value).digest("hex");
}

before(() => {
  process.env.CLOUDINARY_CLOUD_NAME = "divinebirth";
  process.env.CLOUDINARY_API_KEY = "224466";
  process.env.CLOUDINARY_API_SECRET = "test-secret";
  process.env.CLOUDINARY_BOOKINGS_FOLDER = "divine-birth/bookings";
  delete process.env.CLOUDINARY_UPLOAD_PRESET;
});

after(() => {
  for (const key of Object.keys(process.env)) {
    if (!(key in ORIGIN)) delete process.env[key];
  }
  Object.assign(process.env, ORIGIN);
});

describe("cloudinary pipeline", () => {
  it("is ready only when cloud + signed keys (or unsigned preset) exist", async () => {
    const { cloudinaryReady } = await import("./cloudinary.server.ts");
    assert.equal(cloudinaryReady(), true);
  });

  it("rejects a forged webhook signature", async () => {
    const { verifyCloudinaryWebhook } = await import("./cloudinary.server.ts");
    const body = '{"public_id":"x"}';
    const ts = "1710000000";
    assert.equal(verifyCloudinaryWebhook(ts, "deadbeef", body), false);
    const good = sha1(body + ts + "test-secret");
    assert.equal(verifyCloudinaryWebhook(ts, good, body), true);
  });

  it("uploads a booking card with signed params and form context (Smartech pattern)", async () => {
    calls.length = 0;
    const prev = globalThis.fetch;
    globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      const body = typeof init?.body === "string" ? init.body : String(init?.body ?? "");
      calls.push({ url, body });
      assert.match(url, /api\.cloudinary\.com\/v1_1\/divinebirth\/image\/upload/);
      return new Response(
        JSON.stringify({
          public_id: "divine-birth/bookings/appointment-abc",
          secure_url: "https://res.cloudinary.com/divinebirth/image/upload/appointment-abc.png",
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }) as typeof fetch;

    try {
      const { uploadBookingToCloudinary } = await import("./cloudinary.server.ts");
      const result = await uploadBookingToCloudinary({
        publicId: "appointment-abc",
        fileDataUrl: "data:image/svg+xml;base64,PHN2Zy4uLg==",
        notificationUrl: "https://www.divinebirthmidwiferycenter.com/api/webhooks/cloudinary",
        context: {
          kind: "appointment",
          name: "Grace Wanjiru",
          phone: "0794444141",
          service: "Birthing Services",
          date: "2026-09-20",
          time: "09:00",
          notes: "first baby",
          ref: "abc",
          clinic: "Divine Birth Midwifery Centre",
        },
      });
      assert.equal(result?.publicId, "divine-birth/bookings/appointment-abc");
      assert.match(result?.url ?? "", /res\.cloudinary\.com/);
      assert.equal(calls.length, 1);
      const params = new URLSearchParams(calls[0]!.body);
      assert.equal(params.get("folder"), "divine-birth/bookings");
      assert.equal(params.get("public_id"), "appointment-abc");
      assert.equal(params.get("api_key"), "224466");
      assert.ok(params.get("signature"));
      assert.match(params.get("context") ?? "", /name=Grace Wanjiru/);
      assert.match(params.get("context") ?? "", /ref=abc/);
      assert.equal(
        params.get("notification_url"),
        "https://www.divinebirthmidwiferycenter.com/api/webhooks/cloudinary",
      );
      const signed: Record<string, string> = {
        context: params.get("context")!,
        folder: params.get("folder")!,
        notification_url: params.get("notification_url")!,
        overwrite: params.get("overwrite")!,
        public_id: params.get("public_id")!,
        timestamp: params.get("timestamp")!,
      };
      const canonical = Object.keys(signed)
        .sort()
        .map((k) => `${k}=${signed[k]}`)
        .join("&");
      assert.equal(params.get("signature"), sha1(canonical + "test-secret"));
    } finally {
      globalThis.fetch = prev;
    }
  });

  it("falls back to the 1×1 GIF when the SVG card is rejected", async () => {
    let n = 0;
    const prev = globalThis.fetch;
    globalThis.fetch = (async () => {
      n += 1;
      if (n === 1) {
        return new Response("svg not allowed", { status: 400 });
      }
      return new Response(
        JSON.stringify({
          public_id: "divine-birth/bookings/appointment-gif",
          secure_url: "https://res.cloudinary.com/divinebirth/image/upload/pixel.gif",
        }),
        { status: 200 },
      );
    }) as typeof fetch;
    try {
      const { uploadBookingToCloudinary } = await import("./cloudinary.server.ts");
      const result = await uploadBookingToCloudinary({
        publicId: "appointment-gif",
        fileDataUrl: "data:image/svg+xml;base64,AAA",
        context: { name: "Amina" },
      });
      assert.equal(n, 2);
      assert.match(result?.url ?? "", /pixel\.gif/);
    } finally {
      globalThis.fetch = prev;
    }
  });
});
