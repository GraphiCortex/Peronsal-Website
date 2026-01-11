import React, { useEffect, useRef, useState } from "react";

/**
 * Lazy-mounts children when section is near viewport.
 * Keeps layout height stable by rendering a placeholder of minHeight.
 *
 * Props:
 * - id: section id for anchors/scroll
 * - minHeight: placeholder height (e.g. "100vh" or 900)
 * - rootMargin: how early to mount (e.g. "800px 0px")
 * - once: if true, stays mounted after first reveal
 * - className: pass-through
 */
export default function LazySection({
  id,
  children,
  minHeight = "100vh",
  rootMargin = "800px 0px",
  threshold = 0.01,
  once = false,
  className = "",
}) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          if (once) obs.disconnect();
        } else {
          // If not once, unmount when far again
          if (!once) setMounted(false);
        }
      },
      { root: null, rootMargin, threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin, threshold, once]);

  return (
    <section id={id} ref={ref} className={className} style={{ minHeight }}>
      {mounted ? children : <div style={{ height: minHeight }} />}
    </section>
  );
}
