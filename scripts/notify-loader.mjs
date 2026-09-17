import { existsSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const KNOWN = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs", ".json", ".node"]);

function fileAt(abs) {
  if (existsSync(abs) && KNOWN.has(extname(abs))) return abs;
  for (const ext of [".ts", ".tsx", ".js", ".mjs"]) {
    if (existsSync(abs + ext)) return abs + ext;
  }
  const index = join(abs, "index.ts");
  if (existsSync(index)) return index;
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const resolved = fileAt(join(SRC, specifier.slice(2)));
    if (resolved) return { url: pathToFileURL(resolved).href, shortCircuit: true };
  }
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL) {
    const parent = fileURLToPath(context.parentURL);
    const abs = join(dirname(parent), specifier);
    if (!KNOWN.has(extname(specifier))) {
      const resolved = fileAt(abs);
      if (resolved) return { url: pathToFileURL(resolved).href, shortCircuit: true };
    }
  }
  return nextResolve(specifier, context);
}
