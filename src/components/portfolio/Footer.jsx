import { motion } from "framer-motion";

export default function Footer({ profile }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/40 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-display font-medium text-foreground">
              {profile?.name || "Portfolio"}
            </span>
            <span className="text-border">·</span>
            <span>© {year}</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}