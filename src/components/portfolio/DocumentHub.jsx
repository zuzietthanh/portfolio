import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Check, Mail, FileSpreadsheet } from "lucide-react";

const typeConfig = {
  cv: { icon: FileText, label: "CV" },
  cover_letter: { icon: Mail, label: "Cover Letter" },
  other: { icon: FileSpreadsheet, label: "Document" },
};

function DocumentTile({ doc, index }) {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);
  const config = typeConfig[doc.type] || typeConfig.other;
  const Icon = config.icon;

  const handleDownload = (e) => {
    e.preventDefault();
    if (downloading) return;
    setDownloading(true);
    setDone(false);

    setTimeout(() => {
      const link = document.createElement("a");
      link.href = doc.file_url;
      link.download = doc.title || "document";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDone(true);
      setDownloading(false);
      setTimeout(() => setDone(false), 2000);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass rounded-2xl p-6 hover:glass-strong transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="h-12 w-12 rounded-xl glass-primary flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium px-2.5 py-1 rounded-full glass">
          {config.label}
        </span>
      </div>

      <h3 className="font-display text-lg font-medium text-foreground mb-1">{doc.title}</h3>
      {doc.description && (
        <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{doc.description}</p>
      )}

      <button
        onClick={handleDownload}
        disabled={downloading}
        className="relative w-full overflow-hidden rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold py-3 px-4 flex items-center justify-center gap-2 hover:bg-primary/15 transition-all duration-300 disabled:opacity-70"
      >
        {downloading && (
          <motion.div
            className="absolute left-0 top-0 h-full bg-primary/15"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8 }}
          />
        )}
        <span className="relative flex items-center gap-2">
          {done ? (
            <>
              <Check className="h-4 w-4" />
              Downloaded
            </>
          ) : downloading ? (
            "Preparing..."
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download
            </>
          )}
        </span>
      </button>
    </motion.div>
  );
}

export default function DocumentHub({ documents }) {
  if (!documents || documents.length === 0) return null;

  return (
    <section id="documents" className="relative py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">
              Evidence Suite
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-foreground">
            Documents
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg">
            Download my CV and cover letters directly. Everything you need to move the
            conversation forward.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc, i) => (
            <DocumentTile key={doc.id} doc={doc} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}