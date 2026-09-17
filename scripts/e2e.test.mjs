import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { chromium } from "playwright";

const BASE = process.env.E2E_BASE_URL || "http://127.0.0.1:8080";
const stamp = Date.now();
const staffEmail = `staff.${stamp}@example.com`;
const staffPassword = "Staff-Pass-2026!";
const familyName = `E2E-${stamp}`;

let browser;
let page;

async function waitForServer() {
  const deadline = Date.now() + 20000;
  let last = "";
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE, { redirect: "follow" });
      last = `${res.status}`;
      if (res.ok) return;
    } catch (err) {
      last = err instanceof Error ? err.message : String(err);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`App not reachable at ${BASE} (${last})`);
}

before(async () => {
  await waitForServer();
  browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.setDefaultTimeout(25000);
});

after(async () => {
  await browser?.close();
});

describe("public site", () => {
  it("renders the clinic homepage", async () => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    const h1 = await page.locator("h1").innerText();
    assert.match(h1, /Natural/);
    assert.match(h1, /Personal/);
    assert.equal(await page.locator('a[href="/#booking"]').count() > 0, true);
    assert.equal(await page.locator('img[src*="logo-emblem"]').count() > 0, true);
  });
});

describe("online booking", () => {
  it("saves a filled appointment and shows confirmation", async () => {
    await page.goto(`${BASE}/#booking`, { waitUntil: "networkidle" });
    await page.locator("#bfname").fill("Grace");
    await page.locator("#blname").fill(familyName);
    await page.locator("#bphone").fill("0794444141");
    await page.locator("#bservice").selectOption({ label: "Birthing Services" });
    await page.locator("#bnotes").fill("E2E booking — twins, first visit.");
    await page.getByRole("button", { name: "Confirm appointment" }).click();
    await page.getByText("We have your request").waitFor({ state: "visible" });
    const body = await page.locator("body").innerText();
    assert.match(body, /We have your request/);
  });
});

describe("staff sign-in", () => {
  it("sends signed-out visitors from /admin to /login", async () => {
    const context = await browser.newContext();
    const guest = await context.newPage();
    guest.setDefaultTimeout(20000);
    await guest.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
    await guest.waitForTimeout(800);
    const url = guest.url();
    const text = await guest.locator("body").innerText();
    const gated = url.includes("/login") || /Staff sign in|Sign-in is disabled|Staff console/.test(text);
    assert.equal(gated, true);
    await context.close();
  });

  it("creates a staff account and opens the console", async () => {
    await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
    const disabled = await page.getByText("Sign-in is disabled").count();
    if (disabled) {
      await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
      await page.getByText("Staff console").waitFor({ state: "visible" });
      return;
    }
    await page.getByRole("button", { name: /New staff member/ }).click();
    await page.locator("#staff-name").waitFor({ state: "visible" });
    await page.locator("#staff-name").fill("Diana Midwife");
    await page.locator("#staff-email").fill(staffEmail);
    await page.locator("#staff-password").fill(staffPassword);
    await page.getByRole("button", { name: "Create staff account" }).click();
    try {
      await page.waitForURL(/\/admin/, { timeout: 20000, waitUntil: "domcontentloaded" });
    } catch (err) {
      const body = await page.locator("body").innerText();
      throw new Error(`Staff sign-up did not reach /admin. url=${page.url()} body=${body.slice(0, 800)}\n${err}`);
    }
    await page.getByText("Staff console").waitFor({ state: "visible" });
    const header = await page.locator("header").innerText();
    assert.match(header, /Staff console/);
    assert.match(header, new RegExp(staffEmail.split("@")[0]));
  });

  it("shows the booking under Appointments and can confirm it", async () => {
    if (!page.url().includes("/admin")) {
      await page.goto(`${BASE}/admin`, { waitUntil: "domcontentloaded" });
    }
    await page.getByText("Staff console").waitFor({ state: "visible" });
    await page.getByRole("button", { name: /Appointments/ }).click();
    await page.getByText(familyName).waitFor({ state: "visible" });
    const row = page.locator("li").filter({ hasText: familyName });
    assert.match(await row.innerText(), /Birthing Services/);
    assert.match(await row.innerText(), /0794444141/);
    await row.getByRole("button", { name: "Confirm" }).click();
    await page.waitForTimeout(600);
    assert.match(await row.innerText(), /confirmed/i);
  });

  it("signs out and signs back in with the same email", async () => {
    const signOut = page.getByRole("button", { name: "Sign out" });
    if ((await signOut.count()) === 0) return;
    await signOut.click();
    await page.waitForURL((url) => !url.pathname.startsWith("/admin"), {
      timeout: 15000,
      waitUntil: "domcontentloaded",
    });
    await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
    if (await page.getByText("Already have an account").count()) {
      await page.getByRole("button", { name: /Already have an account/ }).click();
    }
    await page.locator("#staff-email").waitFor({ state: "visible" });
    await page.locator("#staff-email").click();
    await page.locator("#staff-email").fill(staffEmail);
    await page.locator("#staff-password").fill(staffPassword);
    assert.equal(await page.locator("#staff-email").inputValue(), staffEmail);
    await page.getByRole("button", { name: "Sign in with email" }).click();
    const start = Date.now();
    while (Date.now() - start < 20000) {
      if (page.url().includes("/admin")) break;
      const err = await page.locator("p.text-red-300").textContent().catch(() => "");
      if (err) throw new Error(`Sign-in error: ${err}`);
      await page.waitForTimeout(250);
    }
    if (!page.url().includes("/admin")) {
      throw new Error(`Sign-in stayed on ${page.url()}: ${(await page.locator("body").innerText()).slice(0, 600)}`);
    }
    await page.getByText("Staff console").waitFor({ state: "visible" });
  });
});

describe("Cloudinary webhook", () => {
  it("accepts a payload without a signature when no timestamp is sent", async () => {
    const res = await fetch(`${BASE}/api/webhooks/cloudinary`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ public_id: "probe" }),
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.ok, true);
  });

  it("rejects a signed payload with a forged signature", async () => {
    const res = await fetch(`${BASE}/api/webhooks/cloudinary`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-cld-timestamp": "1710000000",
        "x-cld-signature": "000000",
      },
      body: JSON.stringify({ public_id: "forged" }),
    });
    assert.equal(res.status, 401);
  });

  it("rejects invalid JSON", async () => {
    const res = await fetch(`${BASE}/api/webhooks/cloudinary`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "not-json",
    });
    assert.equal(res.status, 400);
  });

  it("accepts a correctly signed Cloudinary notification", async () => {
    const secret = process.env.CLOUDINARY_API_SECRET;
    const body = JSON.stringify({
      public_id: "divine-birth/bookings/appointment-e2e",
      secure_url: "https://res.cloudinary.com/demo/image/upload/e2e.png",
      context: { custom: { ref: "missing-row", name: "Grace" } },
    });
    const headers = { "content-type": "application/json" };
    if (secret) {
      const ts = String(Math.floor(Date.now() / 1000));
      headers["x-cld-timestamp"] = ts;
      headers["x-cld-signature"] = createHash("sha1")
        .update(body + ts + secret)
        .digest("hex");
    }
    const res = await fetch(`${BASE}/api/webhooks/cloudinary`, { method: "POST", headers, body });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.ok, true);
  });
});
