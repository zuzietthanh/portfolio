import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Download, Mail, FileSpreadsheet, ArrowRight } from "lucide-react";

const typeConfig = {
  cv: { icon: FileText, label: "CV" },
  cover_letter: { icon: Mail, label: "Cover Letter" },
  other: { icon: FileSpreadsheet, label: "Document" },
};

function DocumentTile({ doc, index }) {
  const config = typeConfig[doc.type] || typeConfig.other;
  const Icon = config.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col rounded-2xl glass p-6 transition-colors hover:bg-white/[0.07]"
    >
      <div className="mb-6 flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-xl glass-primary"
        >
          <Icon className="h-5 w-5 text-primary" />
        </span>
        <span className="rounded-full glass px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          {config.label}
        </span>
      </div>

      <h3 className="font-display text-lg font-medium text-foreground">{doc.title}</h3>
      {doc.description && (
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{doc.description}</p>
      )}

      {/* Two distinct actions rather than a card-wide link wrapping a button:
          the detail page carries the revision story and peer feedback, while
          the download stays one click away for anyone who only wants the file. */}
      <div className="mt-6 flex flex-col gap-2 pt-2">
        <Link
          to={`/document/${doc.id}`}
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 active:bg-primary/25"
        >
          View details
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </Link>
        <a
          href={doc.file_url}
          download
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download <span className="sr-only">{doc.title}</span>
        </a>
      </div>
    </motion.article>
  );
}

export default function DocumentHub({ documents }) {
  return (
    <section id="documents" className="relative scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-12 bg-primary" />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
              Evidence Suite
            </span>
          </div>
          <h2 className="font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl">
            Documents
          </h2>
          {/* Deliberately does not promise a revision story on every document:
              those sections only appear once documents.json has one, so a
              blanket claim here would be contradicted by the page it links to. */}
          <p className="mt-4 max-w-lg text-muted-foreground">
            The documents behind my applications, each on its own page with the final file and the
            story of how it got there.
          </p>
        </motion.div>

        {documents.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              No documents yet. Add them to{" "}
              <code className="font-mono text-sm text-foreground">src/content/documents.json</code>{" "}
              and they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc, i) => (
              <DocumentTile key={doc.id} doc={doc} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
