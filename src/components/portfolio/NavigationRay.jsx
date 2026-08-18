import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownToLine, Menu, X } from "lucide-react";
import { getProjects } from "@/lib/content";

// The statement of purpose is a page of its own; everything else is a section
// of the home page. Required coursework leads, so it sits directly after Home
// and the optional work grid moves below the documents.
const ALL_NAV_ITEMS = [
  { kind: "section", id: "hero", label: "Home" },
  { kind: "route", to: "/statement-of-purpose", label: "Statement" },
  { kind: "section", id: "documents", label: "Documents" },
  { kind: "section", id: "work", label: "Work" },
  { kind: "section", id: "contact", label: "Contact" },
];

// The work grid is optional to the brief, so the home page leaves it out while
// projects.json is empty. Its nav entry has to go with it — the brief marks on
// every menu item working, and this one would scroll to a section that is not
// there. Content is imported at build time, so this settles once at load.
const NAV_ITEMS = ALL_NAV_ITEMS.filter(
  (item) => item.id !== "work" || getProjects().length > 0
);

const SECTION_IDS = NAV_ITEMS.filter((item) => item.kind === "section").map((item) => item.id);

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
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
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

  // A route item is active by URL; a section item only while its page is shown.
  const isItemActive = (item) =>
    item.kind === "route"
      ? location.pathname === item.to
      : location.pathname === "/" && activeSection === item.id;

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
          className="-ml-2 flex min-h-[44px] items-center rounded-lg px-2 font-display text-base font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          {profile?.name || "Portfolio"}
          <span className="text-primary">.</span>
        </button>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = isItemActive(item);
              const className = `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`;
              return (
                <li key={item.label}>
                  {item.kind === "route" ? (
                    <Link
                      to={item.to}
                      aria-current={isActive ? "page" : undefined}
                      className={className}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => scrollTo(item.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={className}
                    >
                      {item.label}
                    </button>
                  )}
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
                {NAV_ITEMS.map((item) => {
                  const isActive = isItemActive(item);
                  const className = `block w-full rounded-lg px-4 py-3 text-left text-base font-medium transition-colors ${
                    isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
                  }`;
                  return (
                    <li key={item.label}>
                      {item.kind === "route" ? (
                        <Link
                          to={item.to}
                          onClick={() => setMenuOpen(false)}
                          aria-current={isActive ? "page" : undefined}
                          className={className}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => scrollTo(item.id)}
                          aria-current={isActive ? "true" : undefined}
                          className={className}
                        >
                          {item.label}
                        </button>
                      )}
                    </li>
                  );
                })}
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
