// Public endpoint.
//   GET  /api/feedback?doc=cv   published feedback for one document
//   POST /api/feedback          a reviewer submits, held as pending
//
// Nothing a visitor posts reaches the live page without the owner approving it
// in /review first.

import { randomUUID } from "node:crypto";

import {
  readAll,
  writeAll,
  readBody,
  send,
  query,
  clean,
  publicShape,
  storageIsUsable,
} from "./_lib.js";

const MAX_PENDING = 300;

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const doc = query(req).get("doc");
      const items = await readAll();
      const feedback = items
        .filter((item) => item.status === "published" && (!doc || item.doc === doc))
        .map(publicShape);
      return send(res, 200, { feedback });
    }

    if (req.method === "POST") {
      if (!storageIsUsable()) {
        return send(res, 503, {
          error: "Feedback is not switched on yet. Please send your comments another way.",
        });
      }

      const body = await readBody(req);

      // Bots fill in every field they find. A real person never sees this one.
      if (clean(body.website, "reviewer")) return send(res, 201, { ok: true });

      const reviewer = clean(body.reviewer, "reviewer");
      const comment = clean(body.comment, "comment");
      const doc = clean(body.doc, "doc");

      if (!reviewer) return send(res, 400, { error: "Please add your name." });
      if (!comment) return send(res, 400, { error: "Please write your feedback first." });
      if (!doc) return send(res, 400, { error: "Missing document reference." });

      const items = await readAll();
      if (items.filter((item) => item.status === "pending").length >= MAX_PENDING) {
        return send(res, 429, { error: "Too many pending submissions. Try again later." });
      }

      items.push({
        id: randomUUID(),
        doc,
        reviewer,
        comment,
        response: "",
        date: "",
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      await writeAll(items);

      return send(res, 201, { ok: true });
    }

    res.setHeader("Allow", "GET, POST");
    return send(res, 405, { error: "Method not allowed." });
  } catch (error) {
    console.error("[feedback]", error);
    return send(res, 500, { error: "Something went wrong. Please try again." });
  }
}
