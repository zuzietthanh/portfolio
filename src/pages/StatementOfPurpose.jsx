import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { getProfile, getStatement, getDocuments } from "@/lib/content";
import NavigationRay from "@/components/portfolio/NavigationRay";
import Footer from "@/components/portfolio/Footer";

export default function StatementOfPurpose() {
  const profile = getProfile();
  const statement = getStatement();
  const documents = getDocuments();
  const cvDoc = documents.find((d) => d.type === "cv");

  return (
    <div className="min-h-screen">
      <NavigationRay profile={profile} cvUrl={cvDoc?.file_url} />

      <main id="main" className="px-4 pb-24 pt-28 sm:px-6 md:pt-36">
        <article className="mx-auto max-w-3xl">
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border-b border-border pb-10"
          >
            {statement.eyebrow && (
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                {statement.eyebrow}
              </p>
            )}
            <h1 className="font-display text-4xl font-medium tracking-tight text-foreground md:text-5xl">
              {statement.title || "Statement of Purpose"}
            </h1>
            {statement.intro && (
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                {statement.intro}
              </p>
            )}
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>{profile?.name}</span>
              {statement.last_updated && (
                <>
                  <span aria-hidden="true" className="text-border">·</span>
                  <span>Updated {statement.last_updated}</span>
                </>
              )}
            </p>
          </motion.header>

          {statement.sections.length === 0 ? (
            <p className="mt-12 rounded-2xl border border-border bg-card p-6 text-muted-foreground">
              No sections yet. Add them to{" "}
              <code className="font-mono text-sm text-foreground">src/content/statement.json</code>.
            </p>
          ) : (
            <div className="mt-12 flex flex-col gap-14">
              {statement.sections.map((section, index) => (
                <motion.section
                  key={section.id || index}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5 }}
                  className="scroll-mt-28"
                >
                  <header className="mb-5">
                    <h2 className="font-display text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                      {section.heading}
                    </h2>
                    {section.summary && (
                      <p className="mt-2 text-sm text-muted-foreground">{section.summary}</p>
                    )}
                  </header>
                  {section.body && (
                    <div
                      className="space-y-4 text-base leading-relaxed text-foreground/90 [&_a]:text-primary [&_a]:underline [&_li]:mb-1.5 [&_strong]:text-foreground [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5"
                      dangerouslySetInnerHTML={{ __html: section.body }}
                    />
                  )}
                </motion.section>
              ))}
            </div>
          )}

          <nav
            aria-label="Continue"
            className="mt-16 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to home
            </Link>
            <Link
              to="/#documents"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              See my documents
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </nav>
        </article>
      </main>

      <Footer profile={profile} />
    </div>
  );
}
