import { useEffect, useState } from "react";

/**
 * A thin bar across the top showing how far down the page you are.
 *
 * Purely informational, so it is hidden from assistive technology and removed
 * entirely when the reader has asked for reduced motion — a bar that tracks
 * every scroll event is exactly the kind of continuous movement that setting
 * exists to stop.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setEnabled(!query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    let frame = null;
    const update = () => {
      frame = null;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
    };
    // Coalesce scroll events into one measurement per frame.
    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
      <div
        className="h-full origin-left bg-primary"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
