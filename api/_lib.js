// Shared helpers for the peer-feedback endpoints.
//
// Files in /api starting with "_" are not deployed as routes, so this is a
// plain module both handlers import.
//
// Storage is Upstash Redis over its REST API — no SDK, so nothing to install
// and nothing to keep in step with a package version. Vercel's Upstash
// integration injects the credentials; older and newer integrations use
// different variable names, so both are accepted.

const KEY = "peer-feedback:v1";

const LIMITS = {
  reviewer: 80,
  comment: 1500,
  response: 1500,
  date: 40,
  doc: 60,
};

// Survives module reloads in dev, where Vite may re-import this file.
const memory = (globalThis.__peerFeedbackDevStore ??= new Map());

function credentials() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

export function isConfigured() {
  return credentials() !== null;
}

// Without a database, each serverless invocation gets its own empty memory, so a
// submission would be accepted and then silently vanish. Fail loudly in
// production instead; in local dev the in-memory store is genuinely useful.
export function storageIsUsable() {
  return isConfigured() || !process.env.VERCEL;
}

export async function readAll() {
  const creds = credentials();
  if (!creds) return memory.get(KEY) ?? [];

  const res = await fetch(`${creds.url}/get/${KEY}`, {
    headers: { Authorization: `Bearer ${creds.token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Feedback store read failed (${res.status})`);

  const { result } = await res.json();
  if (!result) return [];
  try {
    const parsed = JSON.parse(result);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeAll(items) {
  const creds = credentials();
  if (!creds) {
    memory.set(KEY, items);
    return;
  }
  const res = await fetch(`${creds.url}/set/${KEY}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${creds.token}` },
    body: JSON.stringify(items),
  });
  if (!res.ok) throw new Error(`Feedback store write failed (${res.status})`);
}

export function clean(value, field) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, LIMITS[field] ?? 200);
}

export function query(req) {
  // Vite's middleware strips the mount path, Vercel's does not. Only the
  // search string is read here, so both shapes work.
  return new URL(req.url || "/", "http://localhost").searchParams;
}

export async function readBody(req) {
  if (req.body !== undefined && req.body !== null && req.body !== "") {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

export function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

/** Only the fields a visitor is allowed to see. */
export function publicShape(item) {
  return {
    id: item.id,
    doc: item.doc,
    reviewer: item.reviewer,
    comment: item.comment,
    response: item.response || "",
    date: item.date || "",
  };
}
