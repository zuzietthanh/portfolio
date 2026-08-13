import { motion } from "framer-motion";
import {
  Linkedin,
  Github,
  Twitter,
  Mail,
  Globe,
  Dribbble,
  PenTool,
  ArrowUpRight,
} from "lucide-react";

const iconMap = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  email: Mail,
  globe: Globe,
  dribbble: Dribbble,
  medium: PenTool,
};

export default function LinkHub({ links, profile }) {
  return (
    <section id="contact" className="relative scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-primary font-semibold">
              Connect
            </span>
            <div className="h-px w-12 bg-primary" />
          </div>
          <h2 className="font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl">
            Get in touch
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            I am open to marketing internships and entry-level roles. The quickest way to reach me
            is email.
          </p>

          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="mt-8 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {profile.email}
            </a>
          )}
        </motion.div>

        {!links || links.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              No links yet. Add them to{" "}
              <code className="font-mono text-sm text-foreground">src/content/links.json</code> and
              they will appear here.
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {links.map((link, i) => {
            const Icon = iconMap[link.icon] || Globe;
            const href = link.icon === "email" ? `mailto:${link.url}` : link.url;
            return (
              <motion.a
                key={link.id}
                href={href}
                target={link.icon === "email" ? undefined : "_blank"}
                rel={link.icon === "email" ? undefined : "noopener noreferrer"}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group glass rounded-2xl p-5 flex items-center justify-between hover:glass-strong hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl glass-primary flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-display text-base font-medium text-foreground">
                      {link.label}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {link.url.replace(/^https?:\/\//, "").replace(/^mailto:/, "")}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-all duration-300" />
              </motion.a>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}