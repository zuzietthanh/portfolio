import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ScrollText } from "lucide-react";

/**
 * The statement of purpose lives on its own page, so the home page needs to
 * point at it prominently — the brief asks for it to be featured as the first
 * artifact, ahead of the documents and the work grid.
 */
export default function StatementCallout({ statement }) {
  if (!statement?.title) return null;

  return (
    <section id="statement" className="relative scroll-mt-24 px-4 py-16 sm:px-6 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl"
      >
        <Link
          to="/statement-of-purpose"
          className="group block rounded-3xl glass p-6 transition-colors hover:bg-white/[0.07] sm:p-10"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <span
              aria-hidden="true"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl glass-primary"
            >
              <ScrollText className="h-6 w-6 text-primary" />
            </span>

            <div className="min-w-0 flex-1">
              {statement.eyebrow && (
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                  {statement.eyebrow}
                </p>
              )}
              <h2 className="font-display text-2xl font-medium tracking-tight text-foreground md:text-4xl">
                {statement.title}
              </h2>
              {statement.intro && (
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                  {statement.intro}
                </p>
              )}

              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Read the statement
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
