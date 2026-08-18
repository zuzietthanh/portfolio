import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";

/** Splits "Thanh Vu" into ["Thanh", "Vu"] so the surname can carry the accent. */
function splitName(name) {
  if (!name) return ["Your", "Name"];
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return [parts[0], ""];
  return [parts.slice(0, -1).join(" "), parts[parts.length - 1]];
}

export default function Hero({ profile }) {
  const [leading, trailing] = splitName(profile?.name);

  // Only render a stat that actually has a value — an empty slot reads as a bug.
  const stats = [
    { label: "Role", value: profile?.role },
    { label: "Focus", value: profile?.specialty },
    { label: "Based in", value: profile?.location },
  ].filter((stat) => Boolean(stat.value));

  const summary = profile?.summary?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  // Trim to roughly 180 characters, but break on a space so a long summary
  // never gets cut mid-word ("and I'm loo…").
  const blurb =
    summary && summary.length > 180
      ? `${summary.slice(0, 180).replace(/\s+\S*$/, "")}…`
      : summary;

  return (
    <section
      id="hero"
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 pb-16 pt-24 sm:px-6 md:pt-28"
    >
      {/* Layer 1 — three slow colour fields. Decorative only. */}
      <div className="hero-aurora" aria-hidden="true">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>

      {/* Layer 2 — the dark scrim that buys back text contrast, plus grain to
          keep the blurred fields from banding on wide screens. */}
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />

      {/* Layer 3 — content. */}
      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        {profile?.tagline && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium text-muted-foreground sm:text-sm"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            {profile.tagline}
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-display font-medium leading-[0.95] tracking-tight text-[clamp(2.75rem,11vw,6rem)]"
        >
          <span className="text-foreground">{leading}</span>
          {trailing && (
            <>
              {" "}
              <span className="text-gradient font-light italic">{trailing}</span>
            </>
          )}
        </motion.h1>

        {blurb && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {blurb}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4"
        >
          <button
            type="button"
            onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80"
          >
            View my work
            <ArrowDown
              className="h-4 w-4 transition-transform group-hover:translate-y-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center justify-center rounded-full glass px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-white/10 active:bg-white/[0.14]"
          >
            Get in touch
          </button>
        </motion.div>

        {stats.length > 0 && (
          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.38 }}
            className="mx-auto mt-16 flex max-w-2xl flex-wrap items-start justify-center gap-x-12 gap-y-8"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-[7rem] text-center">
                <dt className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="font-display text-lg font-medium text-foreground md:text-xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        )}
      </div>

      {/* Scroll cue — hidden on short viewports where it would crowd the stats. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-muted-foreground/30 p-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-1.5 w-1 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}
