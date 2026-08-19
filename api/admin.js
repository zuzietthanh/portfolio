// Owner-only endpoint behind ADMIN_PASSWORD.
//   GET  /api/admin              everything, pending first
//   POST /api/admin              { id, action: publish | unpublish | delete, response?, date? }
//
// Fails closed: with no ADMIN_PASSWORD set, nothing is readable or editable.

// timingSafeEqual lives on node:crypto, not on the global Web Crypto object
// that provides randomUUID. Reaching for globalThis.crypto here throws.
import { timingSafeEqual } from "node:crypto";

import { readAll, writeAll, readBody, send, clean } from "./_lib.js";

function authorised(req) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return { ok: false, status: 503, error: "No admin password is set on the server yet." };

  const given = req.headers["x-admin-key"];
  const a = Buffer.from(String(given ?? ""));
  const b = Buffer.from(secret);
  // Compare in constant time, but only when the lengths already match —
  // timingSafeEqual throws on a length mismatch.
  const match = a.length === b.length && timingSafeEqual(a, b);
  if (!match) return { ok: false, status: 401, error: "Wrong password." };

  return { ok: true };
}

export default async function handler(req, res) {
  try {
    const auth = authorised(req);
    if (!auth.ok) return send(res, auth.status, { error: auth.error });

    if (req.method === "GET") {
      const items = await readAll();
      const rank = { pending: 0, published: 1 };
      items.sort(
        (x, y) =>
          (rank[x.status] ?? 2) - (rank[y.status] ?? 2) ||
          String(y.createdAt).localeCompare(String(x.createdAt))
      );
      return send(res, 200, { items });
    }

    if (req.method === "POST") {
      const body = await readBody(req);
      const id = clean(body.id, "doc");
      const action = clean(body.action, "doc");
      if (!id) return send(res, 400, { error: "Missing id." });

      const items = await readAll();
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return send(res, 404, { error: "That item no longer exists." });

      if (action === "delete") {
        items.splice(index, 1);
      } else if (action === "publish") {
        items[index] = {
          ...items[index],
          status: "published",
          response: clean(body.response, "response"),
          date: clean(body.date, "date"),
        };
      } else if (action === "unpublish") {
        items[index] = { ...items[index], status: "pending" };
      } else {
        return send(res, 400, { error: "Unknown action." });
      }

      await writeAll(items);
      return send(res, 200, { ok: true });
    }

    res.setHeader("Allow", "GET, POST");
    return send(res, 405, { error: "Method not allowed." });
  } catch (error) {
    console.error("[admin]", error);
    return send(res, 500, { error: "Something went wrong." });
  }
}
