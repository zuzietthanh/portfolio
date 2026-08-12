import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function Hero({ profile }) {
  const stats = [
    { label: "Role", value: profile?.role || "Software Engineer" },
    { label: "Experience", value: `${profile?.years_experience || 5}+ Years` },
    { label: "Specialty", value: profile?.specialty || "Full-Stack" },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden noise-bg pt-24 pb-16"
    >
      {/* Ambient gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="glass rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {profile?.tagline || "Available for new opportunities"}
          </div>
        </motion.div>

        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-medium tracking-tight leading-[0.95]"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
          >
            <span className="text-foreground">{profile?.name?.split(" ")[0] || "Your"}</span>
            <br />
            <span className="text-gradient italic font-light">
              {profile?.name?.split(" ").slice(1).join(" ") || "Name"}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 max-w-xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            {profile?.summary?.replace(/<[^>]*>/g, "")?.slice(0, 160) ||
              "Building precise, performant software with a focus on clean architecture and thoughtful user experiences."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
              className="group flex items-center gap-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold px-6 py-3.5 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20"
            >
              View Work
              <ArrowDown className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full glass hover:glass-strong text-sm font-semibold px-6 py-3.5 transition-all duration-300"
            >
              Get in Touch
            </button>
          </motion.div>

          {/* Data points */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 grid grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  {stat.label}
                </div>
                <div className="font-display text-lg md:text-2xl font-medium text-foreground">
                  {stat.value}
                </div>
                {i < stats.length - 1 && (
                  <div className="hidden md:block absolute" />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-9 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}