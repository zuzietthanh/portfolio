import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownToLine, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "work", label: "Work" },
  { id: "documents", label: "Documents" },
  { id: "contact", label: "Contact" },
];

export default function NavigationRay({ profile, cvUrl }) {
  const [activeSection, setActiveSection] = useState("hero");
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // The bar stays transparent only while it overlaps the hero, which supplies
  // the dark scrim behind it. Anywhere else it sits over ordinary content, so
  // it goes solid. Pages without a hero start solid.
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) {
      setSolid(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setSolid(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [location.pathname]);

  // Highlight whichever section currently owns the middle of the viewport.
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);

  // Lock the page behind the mobile menu while it is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const scrollTo = useCallback(
    (id) => {
      setMenuOpen(false);
      const go = () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      if (location.pathname !== "/") {
        navigate("/");
        // Wait for the home route to mount before looking for the section.
        requestAnimationFrame(() => requestAnimationFrame(go));
      } else {
        go();
      }
    },
    [location.pathname, navigate]
  );

  return (
    <header className={`fixed inset-x-0 top-0 z-50 nav-bar ${solid ? "nav-bar-solid" : ""}`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 md:h-20">
        <button
          type="button"
          onClick={() => scrollTo("hero")}
          className="-ml-2 rounded-lg px-2 py-2 font-display text-base font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          {profile?.name || "Portfolio"}
          <span className="text-primary">.</span>
        </button>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(item.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {cvUrl && (
            <a
              href={cvUrl}
              download
              className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
            >
              <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
              Download CV
            </a>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <nav aria-label="Mobile" className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(item.id)}
                      className={`w-full rounded-lg px-4 py-3 text-left text-base font-medium transition-colors ${
                        activeSection === item.id
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
              {cvUrl && (
                <a
                  href={cvUrl}
                  download
                  onClick={() => setMenuOpen(false)}
                  className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
                  Download CV
                </a>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
