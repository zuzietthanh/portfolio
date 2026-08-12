import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownToLine, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function NavigationRay({ profile, cvUrl }) {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [pastProject, setPastProject] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "work", label: "Work" },
    { id: "documents", label: "Documents" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);

      const workSection = document.getElementById("work");
      if (workSection) {
        const rect = workSection.getBoundingClientRect();
        setPastProject(rect.bottom < window.innerHeight * 0.5);
      }

      const sections = navItems.map((item) => document.getElementById(item.id));
      const current = sections.findIndex((section) => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom >= 120;
      });
      if (current !== -1) setActiveSection(navItems[current].id);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl"
      >
        <div
          className={`glass-nav rounded-full px-3 py-2 flex items-center justify-between gap-2 transition-all duration-500 ${
            scrolled ? "shadow-2xl shadow-black/5" : ""
          }`}
        >
          <button
            onClick={() => scrollTo("hero")}
            className="font-display font-semibold text-sm tracking-tight pl-2 pr-1 text-foreground whitespace-nowrap"
          >
            {profile?.name?.split(" ")[0] || "Portfolio"}
            <span className="text-primary">.</span>
          </button>

          <div className="hidden md:flex items-center gap-1 relative">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="relative px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-300"
              >
                <span
                  className={
                    activeSection === item.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }
                >
                  {item.label}
                </span>
                {activeSection === item.id && (
                  <motion.div
                    layoutId="nav-ray"
                    className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {cvUrl && (
              <a
                href={cvUrl}
                download
                className={`hidden sm:flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-3.5 py-2 transition-all duration-300 hover:scale-105 ${
                  pastProject ? "breathing-glow" : ""
                }`}
              >
                <ArrowDownToLine className="h-3.5 w-3.5" />
                CV
              </a>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden h-9 w-9 rounded-full flex items-center justify-center glass"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 glass-strong rounded-2xl p-2 flex flex-col gap-1"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-left px-4 py-2.5 text-sm font-medium rounded-xl hover:bg-primary/10 transition-colors"
                >
                  {item.label}
                </button>
              ))}
              {cvUrl && (
                <a
                  href={cvUrl}
                  download
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-primary text-primary-foreground"
                >
                  <ArrowDownToLine className="h-4 w-4" />
                  Download CV
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}