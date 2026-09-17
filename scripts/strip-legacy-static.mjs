#!/usr/bin/env node
/**
 * The old Divine Birth repo was a static HTML site (index.html + css/ + js/ +
 * assets/). If those files stay in the repo, Vercel serves that HTML for every
 * URL — including stylesheets — so the live site looks like plain text.
 * Remove them before build so only the new app ships.
 */
import { existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const leftover = ["index.html", "css", "js", "assets", "manifest.json", "sw.js", "admin.html", "admin-media.html"];

for (const name of leftover) {
  const path = join(root, name);
  if (!existsSync(path)) continue;
  rmSync(path, { recursive: true, force: true });
  console.log(`[strip-legacy] removed ${name}`);
}
