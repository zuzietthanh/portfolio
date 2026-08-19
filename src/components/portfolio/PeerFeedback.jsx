import { useCallback, useEffect, useState } from "react";
import { MessageSquareQuote, Send, Loader2 } from "lucide-react";

const EMPTY_SLOTS = 2;

/** One published review: what they said, then what you did about it. */
function Entry({ item }) {
  return (
    <li className="rounded-2xl glass p-5 sm:p-6">
      <figure>
        <blockquote className="border-l-2 border-primary/40 pl-4 text-base italic leading-relaxed text-foreground/90">
          {item.comment}
        </blockquote>
        <figcaption className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{item.reviewer}</span>
          {item.date && (
            <>
              <span aria-hidden="true" className="text-muted-foreground">
                ·
              </span>
              <span>{item.date}</span>
            </>
          )}
        </figcaption>
      </figure>

      {item.response && (
        <div className="mt-4 border-t border-border/60 pt-4">
          <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
            What I did
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">{item.response}</p>
        </div>
      )}
    </li>
  );
}

/** A reserved place, so the section reads as ready rather than missing. */
function EmptySlot({ index }) {
  return (
    <li className="rounded-2xl border border-dashed border-border p-5 sm:p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Reviewer {index}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Awaiting peer review. Use the form below to leave feedback on this document.
      </p>
    </li>
  );
}

/**
 * Peer feedback for one document.
 *
 * Two sources are merged: entries written by hand in documents.json, and
 * entries submitted through the form and approved by the owner. The rest of the
 * site reads its content at build time; this section cannot, because a review
 * submitted after the last deploy has to appear without one.
 */
export default function PeerFeedback({ docId, staticFeedback = [] }) {
  const [live, setLive] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({ reviewer: "", comment: "", website: "" });
  const [state, setState] = useState({ status: "idle", message: "" });

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/feedback?doc=${encodeURIComponent(docId)}`);
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      setLive(Array.isArray(data.feedback) ? data.feedback : []);
    } catch {
      // The hand-written entries still render, so a failure here is quiet.
      setLive([]);
    } finally {
      setLoaded(true);
    }
  }, [docId]);

  useEffect(() => {
    load();
  }, [load]);

  async function onSubmit(event) {
    event.preventDefault();
    if (state.status === "sending") return;

    if (!form.reviewer.trim() || !form.comment.trim()) {
      setState({ status: "error", message: "Please fill in both your name and your feedback." });
      return;
    }

    setState({ status: "sending", message: "" });
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, doc: docId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "That did not send.");

      setForm({ reviewer: "", comment: "", website: "" });
      setState({
        status: "sent",
        message: "Thank you — your feedback was sent and will appear once it has been read.",
      });
    } catch (error) {
      setState({ status: "error", message: error.message });
    }
  }

  const entries = [...staticFeedback, ...live];
  const missing = Math.max(0, EMPTY_SLOTS - entries.length);
  const field =
    "w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <section className="mt-16 scroll-mt-28">
      <header className="mb-6 flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl glass-primary"
        >
          <MessageSquareQuote className="h-5 w-5 text-primary" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-medium tracking-tight text-foreground md:text-3xl">
            Peer feedback
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            What reviewers said, and what I did about it.
          </p>
        </div>
      </header>

      <ul className="space-y-4">
        {entries.map((item, index) => (
          <Entry key={item.id || `${item.reviewer}-${index}`} item={item} />
        ))}
        {loaded &&
          Array.from({ length: missing }, (_, i) => (
            <EmptySlot key={`slot-${i}`} index={entries.length + i + 1} />
          ))}
      </ul>

      <div className="mt-8 rounded-2xl glass p-5 sm:p-6">
        <h3 className="font-display text-lg font-medium text-foreground">Leave a review</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          For classmates reviewing this document. Your comment is sent to me first and appears here
          once I have read it and written my response.
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <div>
            <label htmlFor={`reviewer-${docId}`} className="sr-only">
              Your name
            </label>
            <input
              id={`reviewer-${docId}`}
              className={field}
              placeholder="Your name"
              value={form.reviewer}
              maxLength={80}
              onChange={(e) => setForm({ ...form, reviewer: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor={`comment-${docId}`} className="sr-only">
              Your feedback
            </label>
            <textarea
              id={`comment-${docId}`}
              className={`${field} min-h-[120px] resize-y`}
              placeholder="What worked, and what would you change? Specific comments are more useful than praise."
              value={form.comment}
              maxLength={1500}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            />
          </div>

          {/* Bots complete every field they can find; nobody else ever sees this. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={state.status === "sending"}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {state.status === "sending" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
              Send feedback
            </button>

            {state.message && (
              <p
                role="status"
                className={`text-sm ${state.status === "error" ? "text-destructive" : "text-primary"}`}
              >
                {state.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
