import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowDownToLine,
  ExternalLink,
  FileText,
  Mail,
  FileSpreadsheet,
  MessageSquareQuote,
  History,
} from "lucide-react";
import { getProfile, getDocument, getDocuments } from "@/lib/content";
import NavigationRay from "@/components/portfolio/NavigationRay";
import Footer from "@/components/portfolio/Footer";

const TYPE_CONFIG = {
  cv: { icon: FileText, label: "CV" },
  cover_letter: { icon: Mail, label: "Cover Letter" },
  other: { icon: FileSpreadsheet, label: "Document" },
};

/** Section heading with a matching icon well, repeated for each required part. */
function SectionHeading({ icon: Icon, title, subtitle }) {
  return (
    <header className="mb-6 flex items-start gap-4">
      <span
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl glass-primary"
      >
        <Icon className="h-5 w-5 text-primary" />
      </span>
      <div>
        <h2 className="font-display text-2xl font-medium tracking-tight text-foreground md:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </header>
  );
}

export default function DocumentDetail() {
  const { id } = useParams();

  const profile = getProfile();
  const doc = getDocument(id);
  const documents = getDocuments();
  const cvDoc = documents.find((d) => d.type === "cv");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!doc) {
    return (
      <div className="min-h-screen">
        <NavigationRay profile={profile} cvUrl={cvDoc?.file_url} />
        <main id="main" className="flex min-h-svh flex-col items-center justify-center gap-5 px-6 text-center">
          <h1 className="font-display text-3xl font-medium text-foreground">Document not found</h1>
          <p className="max-w-md text-muted-foreground">
            This document may have been renamed or removed from your content files.
          </p>
          <Link
            to="/#documents"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All documents
          </Link>
        </main>
        <Footer profile={profile} />
      </div>
    );
  }

  const config = TYPE_CONFIG[doc.type] || TYPE_CONFIG.other;
  const TypeIcon = config.icon;
  const process = Array.isArray(doc.process_evidence) ? doc.process_evidence : [];
  const feedback = Array.isArray(doc.peer_feedback) ? doc.peer_feedback : [];

  return (
    <div className="min-h-screen">
      <NavigationRay profile={profile} cvUrl={cvDoc?.file_url} />

      <main id="main" className="px-4 pb-24 pt-28 sm:px-6 md:pt-36">
        <article className="mx-auto max-w-3xl">
          <Link
            to="/#documents"
            className="mb-8 inline-flex items-center gap-2 rounded-lg py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All documents
          </Link>

          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border-b border-border pb-10"
          >
            <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
              <TypeIcon className="h-4 w-4" aria-hidden="true" />
              {config.label}
            </p>
            <h1 className="font-display text-4xl font-medium tracking-tight text-foreground md:text-5xl">
              {doc.title}
            </h1>
            {doc.summary && (
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{doc.summary}</p>
            )}
          </motion.header>

          {/* 1 — the final document itself */}
          <section className="mt-12 scroll-mt-28">
            <SectionHeading
              icon={TypeIcon}
              title="The document"
              subtitle="The final version, as submitted."
            />

            <div className="rounded-2xl glass p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={doc.file_url}
                  download
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80"
                >
                  <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
                  Download {config.label}
                </a>
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full glass px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/10"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Open in new tab
                </a>
                {doc.external_url && (
                  <a
                    href={doc.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full glass px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/10"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    View live profile
                  </a>
                )}
              </div>

              {/* An inline preview so a reader can see the document without
                  downloading it. Hidden on small screens, where embedded PDF
                  viewers are unreliable and the buttons above serve better. */}
              <div className="mt-5 hidden overflow-hidden rounded-xl border border-border bg-secondary md:block">
                <object
                  data={doc.file_url}
                  type="application/pdf"
                  aria-label={`Preview of ${doc.title}`}
                  className="h-[36rem] w-full"
                >
                  <p className="p-6 text-sm text-muted-foreground">
                    Your browser cannot display this file inline.{" "}
                    <a href={doc.file_url} download className="text-primary underline">
                      Download it instead
                    </a>
                    .
                  </p>
                </object>
              </div>
            </div>
          </section>

          {/* 2 — revision narrative and evidence of process */}
          <section className="mt-16 scroll-mt-28">
            <SectionHeading
              icon={History}
              title="How it changed"
              subtitle="The revision story, and the drafts behind it."
            />

            {doc.revision_narrative && (
              <div
                className="space-y-4 text-base leading-relaxed text-foreground/90 [&_a]:text-primary [&_a]:underline [&_strong]:font-semibold [&_strong]:text-foreground"
                dangerouslySetInnerHTML={{ __html: doc.revision_narrative }}
              />
            )}

            {process.length > 0 && (
              <ol className="mt-8 space-y-3">
                {process.map((step, index) => (
                  <li
                    key={`${step.label}-${index}`}
                    className="rounded-2xl glass p-5 transition-colors hover:bg-white/[0.07]"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-display text-base font-medium text-foreground">
                        {step.label}
                      </h3>
                      {step.date && (
                        <span className="font-mono text-xs text-muted-foreground">{step.date}</span>
                      )}
                    </div>
                    {step.note && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {step.note}
                      </p>
                    )}
                    {step.file_url && (
                      <a
                        href={step.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        View this version
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* 3 — peer feedback */}
          <section className="mt-16 scroll-mt-28">
            <SectionHeading
              icon={MessageSquareQuote}
              title="Peer feedback"
              subtitle="What reviewers said, and what I did about it."
            />

            {feedback.length === 0 ? (
              <p className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
                No peer feedback recorded yet. Add it to{" "}
                <code className="font-mono text-sm text-foreground">
                  src/content/documents.json
                </code>
                .
              </p>
            ) : (
              <ul className="space-y-4">
                {feedback.map((item, index) => (
                  <li key={`${item.reviewer}-${index}`} className="rounded-2xl glass p-5 sm:p-6">
                    <figure>
                      <blockquote className="border-l-2 border-primary/40 pl-4 text-base italic leading-relaxed text-foreground/90">
                        {item.comment}
                      </blockquote>
                      <figcaption className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{item.reviewer}</span>
                        {item.date && (
                          <>
                            <span aria-hidden="true" className="text-border">·</span>
                            <span>{item.date}</span>
                          </>
                        )}
                      </figcaption>
                    </figure>

                    {item.response && (
                      <div className="mt-4 border-t border-border/60 pt-4">
                        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                          What I did
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {item.response}
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <nav
            aria-label="Continue"
            className="mt-16 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between"
          >
            <Link
              to="/#documents"
              className="inline-flex items-center gap-2 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All documents
            </Link>
            <Link
              to="/statement-of-purpose"
              className="inline-flex items-center justify-center gap-2 rounded-full glass px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/10"
            >
              Read my statement of purpose
            </Link>
          </nav>
        </article>
      </main>

      <Footer profile={profile} />
    </div>
  );
}
