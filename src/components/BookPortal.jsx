import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { SectionWrapper } from "../hoc";
import ContactForm from "./ContactForm";
import AlchemyBookMenu from "./canvas/AlchemyBookMenu";

function CVPanel() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h2 className="text-3xl font-semibold">CV</h2>
        <div className="flex gap-3">
          <a
            href="/CV.pdf"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/40"
          >
            View CV
          </a>
          <a
            href="/CV.pdf"
            download
            className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/40"
          >
            Download CV
          </a>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
        <iframe title="CV" src="/CV.pdf" className="w-full h-[75vh]" />
      </div>
    </div>
  );
}

function ContactPanel() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">Contact</h2>
      {/* Your real EmailJS form lives here */}
      <ContactForm />
    </div>
  );
}

function BookPortal() {
  // "menu" | "cv" | "contact"
  const [mode, setMode] = useState("menu");

  // Fade-in only when this section enters the viewport (once)
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.35, once: true });
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (isInView) setHasEntered(true);
  }, [isInView]);

  const handleSelect = (v) => {
    if (v === "cv") return setMode("cv");
    if (v === "contact") return setMode("contact");
    setMode("menu");
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {mode === "menu" ? (
          <motion.div
            key="book"
            className="absolute inset-0 z-[20] w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: hasEntered ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ willChange: "opacity" }}
          >
            <AlchemyBookMenu onSelect={handleSelect} />
          </motion.div>
        ) : (
          <motion.div
            key={`panel-${mode}`}
            className="relative z-[30] pt-24 pb-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ willChange: "opacity" }}
          >
            <div className="max-w-7xl mx-auto px-6">
              <button
                onClick={() => setMode("menu")}
                className="mb-8 px-4 py-2 rounded-lg border border-white/20 hover:border-white/40"
              >
                ← Back
              </button>

              {mode === "cv" && <CVPanel />}
              {mode === "contact" && <ContactPanel />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default SectionWrapper(BookPortal, "bookportal");
