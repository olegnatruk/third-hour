/**
 * Minimal Canvas LMS REST client. No dependencies — uses Node 24's built-in fetch.
 * Read-only usage. Credentials come from canvas/.local.env (gitignored).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));

/** Parse a dead-simple KEY=VALUE env file. Missing file is not an error. */
function loadLocalEnv(): void {
  let raw: string;
  try {
    raw = readFileSync(join(HERE, ".local.env"), "utf8");
  } catch {
    return;
  }
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

loadLocalEnv();

const BASE_URL = process.env.CANVAS_BASE_URL?.replace(/\/+$/, "");
const TOKEN = process.env.CANVAS_TOKEN;

if (!BASE_URL || !TOKEN) {
  console.error(
    "Missing CANVAS_BASE_URL and/or CANVAS_TOKEN.\n" +
      "Copy canvas/.local.env.example to canvas/.local.env and fill in your values.",
  );
  process.exit(1);
}

export type Params = Record<string, string | number | string[] | undefined>;

function buildUrl(path: string, params?: Params): string {
  const url = new URL(`${BASE_URL}/api/v1${path.startsWith("/") ? path : `/${path}`}`);
  url.searchParams.set("per_page", "100");
  if (params) {
    for (const [key, val] of Object.entries(params)) {
      if (val === undefined) continue;
      if (Array.isArray(val)) {
        for (const v of val) url.searchParams.append(key, v);
      } else {
        url.searchParams.set(key, String(val));
      }
    }
  }
  return url.toString();
}

async function request(url: string): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Network error calling ${url}\n  ${msg}`);
  }
  if (!res.ok) {
    let body = "";
    try {
      body = await res.text();
    } catch {
      /* ignore */
    }
    const hint =
      res.status === 401
        ? " (check that CANVAS_TOKEN is valid and not expired)"
        : res.status === 404
          ? " (not found, or your token lacks access to it)"
          : "";
    throw new Error(`Canvas API ${res.status} ${res.statusText}${hint}\n  ${url}\n  ${body.slice(0, 500)}`);
  }
  return res;
}

/** Single GET returning parsed JSON. */
export async function canvasGet<T>(path: string, params?: Params): Promise<T> {
  const res = await request(buildUrl(path, params));
  return (await res.json()) as T;
}

/** Parse the RFC 5988 Link header and return the rel="next" URL, if any. */
function nextLink(header: string | null): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(",")) {
    const m = part.match(/<([^>]+)>\s*;\s*rel="?next"?/);
    if (m) return m[1];
  }
  return undefined;
}

/** GET that follows pagination and concatenates all pages into one array. */
export async function canvasGetAll<T>(path: string, params?: Params): Promise<T[]> {
  let url: string | undefined = buildUrl(path, params);
  const out: T[] = [];
  while (url) {
    const res: Response = await request(url);
    const page = (await res.json()) as T[];
    if (Array.isArray(page)) out.push(...page);
    url = nextLink(res.headers.get("link"));
  }
  return out;
}

export { BASE_URL };
