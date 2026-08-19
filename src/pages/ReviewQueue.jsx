import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Trash2, Undo2, Loader2 } from "lucide-react";

const STORAGE_KEY = "reviewQueueKey";

/**
 * Private moderation queue at /review.
 *
 * Deliberately absent from the site's navigation and marked noindex: it is
 * reached by typing the address. The password is only ever held in
 * sessionStorage, so it is gone when the tab closes.
 */
export default function ReviewQueue() {
  const [key, setKey] = useState(() => sessionStorage.getItem(STORAGE_KEY) || "");
  const [entered, setEntered] = useState("");
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    const tag = document.createElement("meta");
    tag.name = "robots";
    tag.content = "noindex, nofollow";
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  const load = useCallback(async (secret) => {
    if (!secret) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/admin", { headers: { "x-admin-key": secret } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      setItems(Array.isArray(data.items) ? data.items : []);
      setStatus("ready");
      sessionStorage.setItem(STORAGE_KEY, secret);
      setKey(secret);
    } catch (err) {
      setStatus("locked");
      setError(err.message);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (key) load(key);
    else setStatus("locked");
  }, [key, load]);

  async function act(id, action, extra = {}) {
    setError("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ id, action, ...extra }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "That did not work.");
      await load(key);
    } catch (err) {
      setError(err.message);
    }
  }

  const field =
    "w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";

  if (status === "locked" || !key) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-5 px-6">
        <h1 className="font-display text-2xl font-medium text-foreground">Review queue</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(entered);
          }}
          className="w-full max-w-sm space-y-3"
        >
          <label htmlFor="admin-key" className="sr-only">
            Password
          </label>
          <input
            id="admin-key"
            type="password"
            className={field}
            placeholder="Password"
            value={entered}
            onChange={(e) => setEntered(e.target.value)}
          />
          <button
            type="submit"
            className="min-h-[44px] w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open
          </button>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </form>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          Back to the site
        </Link>
      </main>
    );
  }

  const pending = items.filter((item) => item.status === "pending");
  const published = items.filter((item) => item.status === "published");

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to the site
      </Link>

      <h1 className="font-display text-3xl font-medium tracking-tight text-foreground">
        Review queue
      </h1>
      <p className="mt-2 text-muted-foreground">
        Nothing here is on your site until you publish it.
      </p>

      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}
      {status === "loading" && (
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading…
        </p>
      )}

      <section className="mt-10">
        <h2 className="font-display text-xl font-medium text-foreground">
          Waiting for you ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            Nothing waiting. New submissions appear here.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {pending.map((item) => (
              <li key={item.id} className="rounded-2xl glass p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                  {item.doc}
                </p>
                <p className="mt-2 font-medium text-foreground">{item.reviewer}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                  {item.comment}
                </p>

                <div className="mt-4 space-y-3 border-t border-border/60 pt-4">
                  <textarea
                    className={`${field} min-h-[90px] resize-y`}
                    placeholder="What I did about it — this shows under their comment on the page."
                    value={drafts[item.id]?.response ?? ""}
                    onChange={(e) =>
                      setDrafts({
                        ...drafts,
                        [item.id]: { ...drafts[item.id], response: e.target.value },
                      })
                    }
                  />
                  <input
                    className={field}
                    placeholder='When, e.g. "Week 3" — optional'
                    value={drafts[item.id]?.date ?? ""}
                    onChange={(e) =>
                      setDrafts({
                        ...drafts,
                        [item.id]: { ...drafts[item.id], date: e.target.value },
                      })
                    }
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        act(item.id, "publish", {
                          response: drafts[item.id]?.response ?? "",
                          date: drafts[item.id]?.date ?? "",
                        })
                      }
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Publish
                    </button>
                    <button
                      type="button"
                      onClick={() => act(item.id, "delete")}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full glass px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-white/10"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-medium text-foreground">
          On your site ({published.length})
        </h2>

        {published.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            Nothing published yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {published.map((item) => (
              <li key={item.id} className="rounded-2xl glass p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                  {item.doc}
                </p>
                <p className="mt-2 font-medium text-foreground">{item.reviewer}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">{item.comment}</p>
                {item.response && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                    <span className="text-primary">You: </span>
                    {item.response}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => act(item.id, "unpublish")}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full glass px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-white/10"
                  >
                    <Undo2 className="h-4 w-4" aria-hidden="true" />
                    Take down
                  </button>
                  <button
                    type="button"
                    onClick={() => act(item.id, "delete")}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full glass px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-white/10"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
