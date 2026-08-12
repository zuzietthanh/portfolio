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
  if (!links || links.length === 0) return null;

  return (
    <section id="contact" className="relative py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">
              Connect
            </span>
            <div className="h-px w-12 bg-primary" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-foreground">
            Let's Build Together
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            {profile?.email
              ? `Reach out at ${profile.email} or find me on any of these platforms.`
              : "Find me on any of these platforms. Always open to a good conversation."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {links.map((link, i) => {
            const Icon = iconMap[link.icon] || Globe;
            const href = link.icon === "email" ? `mailto:${link.url}` : link.url;
            return (
              <motion.a
                key={link.id}
                href={href}
                target={link.icon === "email" ? undefined : "_blank"}
                rel="noopener noreferrer"
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
      </div>
    </section>
  );
}