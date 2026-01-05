import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
  useTransform,
} from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { textVariant, fadeIn } from "../utils/motion";

const INTERESTS = [
  {
    title: "Dynamical Systems & Chaos",
    note: "Nonlinear systems: when behaviour is stable, when it shifts, and what patterns survive.",
  },
  {
    title: "Fourier Analysis & PDEs",
    note: "Frequency and evolution: using transforms and PDEs to see structure in messy signals.",
  },
  {
    title: "Graph & Category Theory",
    note: "Structure in relationships: how composition and mapping change (or preserve) meaning.",
  },
  {
    title: "Systems Biology & Computational Physiology",
    note: "Models of regulation and constraint in living systems, tied back to data and mechanism.",
  },
  {
    title: "Cognitive Science & Human Behavioural Biology",
    note: "Perception and behaviour under limits: adaptation, decision-making, and internal models.",
  },
  {
    title: "Physics-informed / Structure-aware ML",
    note: "ML with constraints that matter: symmetry, conservation, and inductive bias from structure.",
  },
];



function useSize(ref) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      setSize({ w: cr.width, h: cr.height });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return size;
}

function OrbitItem({
  title,
  theta,
  ringRot,
  centerX,
  centerY,
  radius,
  size,
  dimmed,
  onClick,
}) {
  // position of this bubble as ring rotates
  const x = useTransform(ringRot, (v) => {
    const a = ((theta + v) * Math.PI) / 180;
    return centerX + radius * Math.cos(a) - size / 2;
  });

  const y = useTransform(ringRot, (v) => {
    const a = ((theta + v) * Math.PI) / 180;
    return centerY + radius * Math.sin(a) - size / 2;
  });

  // keep label upright: counter (theta + ringRot)
  const labelRot = useTransform(ringRot, (v) => -(theta + v));

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="absolute z-[2]"
      style={{ width: size, height: size, x, y }}
      initial={false}
      animate={{ opacity: dimmed ? 0.22 : 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div
        className={[
          "w-full h-full rounded-full",
          "border border-white/15",
          "bg-white/4 backdrop-blur-md",
          "shadow-[0_0_40px_rgba(255,255,255,0.05)]",
          "grid place-items-center px-5 text-center",
          "hover:border-white/25 hover:bg-white/6",
        ].join(" ")}
      >
        <motion.div style={{ rotate: labelRot }}>
          <div className="text-white text-[13px] tracking-wide leading-snug">
            {title}
          </div>
          <div className="mt-2 text-secondary text-[11px] tracking-wide">
            click to expand
          </div>
        </motion.div>
      </div>
    </motion.button>
  );
}

function toTwoLines(s) {
  const text = String(s || "").trim();
  if (!text) return ["", ""];

  // Prefer splitting at punctuation for readability
  const candidates = [", ", "; ", ": ", " — ", " - "];
  for (const sep of candidates) {
    const idx = text.indexOf(sep);
    if (idx !== -1 && idx > 18 && idx < text.length - 18) {
      return [text.slice(0, idx + 1), text.slice(idx + 2)];
    }
  }

  // Fallback: split near middle on a space
  const mid = Math.floor(text.length / 2);
  let i = text.lastIndexOf(" ", mid);
  if (i < 12) i = text.indexOf(" ", mid);
  if (i === -1) return [text, ""];

  return [text.slice(0, i).trim(), text.slice(i + 1).trim()];
}

function OrbitInterests() {
  const stageRef = useRef(null);
  const { w, h } = useSize(stageRef);

  const [active, setActive] = useState(null);
  const [focusFrom, setFocusFrom] = useState(null); // {x, y, theta, rotAtClick}

  const N = INTERESTS.length;
  const angles = useMemo(() => INTERESTS.map((_, i) => (i / N) * 360), [N]);

  // ---- VISUAL KNOBS (big orbit, real center) ----
  const STAGE_H = 600; // bigger stage => bigger orbit without shrinking circles
  const SIZE = 150;

  // internal padding (keeps orbit off edges, but not “making circles smaller”)
  const PAD_X = 64;
  const PAD_TOP = 0;
  const PAD_BOTTOM = 0;
  // ----------------------------------------------

  // pixel-true center of orbit (the actual target point)
  const innerW = Math.max(0, w - 2 * PAD_X);
  const innerH = Math.max(0, h - PAD_TOP - PAD_BOTTOM);
  const centerX = PAD_X + innerW / 2;
  const centerY = PAD_TOP + innerH / 2;

  // radius that fits (given bigger stage => bigger radius)
  const radius = Math.max(
    160,
    Math.min(innerW, innerH) / 2 - SIZE / 2 - 10
  );

  // background guide ring is independent: lower than orbit center
  const bgRingY = centerY + 70;
  const ringDia = Math.max(520, 2 * radius + 40);

  // rotation
  const ringRot = useMotionValue(0);

  useEffect(() => {
    let ctl;
    if (active === null) {
      ctl = animate(ringRot, 360, {
        duration: 24,
        ease: "linear",
        repeat: Infinity,
      });
    } else {
      // pause when focused
      ctl = animate(ringRot, ringRot.get(), {
        duration: 0.15,
        ease: "easeOut",
      });
    }
    return () => ctl?.stop();
  }, [active, ringRot]);

  const open = (i) => {
    if (w === 0 || h === 0) return;

    const theta = angles[i];
    const rot = ringRot.get();
    const a = ((theta + rot) * Math.PI) / 180;

    const startX = centerX + radius * Math.cos(a) - SIZE / 2;
    const startY = centerY + radius * Math.sin(a) - SIZE / 2;

    setFocusFrom({ x: startX, y: startY, theta, rotAtClick: rot, index: i });
    setActive(i);
  };

  const close = () => {
    setActive(null);
    setFocusFrom(null);
  };

  return (
    <div className="relative w-full flex items-center justify-center">
      <div
        ref={stageRef}
        className="relative w-full max-w-[900px] overflow-hidden"
        style={{ height: STAGE_H }}
      >
        {/* background bed */}
        <div className="pointer-events-none absolute inset-0 z-[0]">
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-[28px] opacity-80"
            style={{
              top: "50%",
              transform: "translateY(-50%) translateX(-50%)",
              width: "96%",
              height: "92%",
              background:
                "radial-gradient(60% 60% at 50% 55%, rgba(255,255,255,0.06), rgba(0,0,0,0) 70%)",
            }}
          />
        </div>

        {/* background guide ring (pulled down) */}
        {w > 0 && h > 0 && (
          <div className="pointer-events-none absolute inset-0 z-[1]">
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 opacity-25"
              style={{
                left: `${centerX}px`,
                top: `${bgRingY}px`,
                width: `${ringDia}px`,
                height: `${ringDia}px`,
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            />
          </div>
        )}

        {/* orbiting circles */}
        {w > 0 && h > 0 && (
          <>
            {INTERESTS.map((item, i) => {
              if (active === i) return null; // hide active in orbit while it animates to center
              return (
                <OrbitItem
                  key={item.title}
                  title={item.title}
                  theta={angles[i]}
                  ringRot={ringRot}
                  centerX={centerX}
                  centerY={centerY}
                  radius={radius}
                  size={SIZE}
                  dimmed={active !== null}
                  onClick={() => open(i)}
                />
              );
            })}
          </>
        )}

        {/* FOCUS: move from exact orbit position -> exact center */}
        <AnimatePresence>
          {active !== null && focusFrom && (
            <motion.button
              key={`focus-${active}`}
              type="button"
              onClick={close}
              className="absolute z-[30]"
              style={{ width: SIZE, height: SIZE }}
              initial={{
                x: focusFrom.x,
                y: focusFrom.y,
                scale: 1,
                opacity: 1,
              }}
              animate={{
                x: centerX - SIZE / 2,
                y: centerY - SIZE / 2,
                scale: 1.25,
                opacity: 1,
              }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <div
                className={[
                  "w-full h-full rounded-full",
                  "border border-white/30",
                  "bg-white/9 backdrop-blur-md",
                  "shadow-[0_0_55px_rgba(255,255,255,0.08)]",
                  "grid place-items-center px-5 text-center",
                ].join(" ")}
              >
                <div>
                  <div className="text-white text-[13px] tracking-wide leading-snug">
                    {INTERESTS[active].title}
                  </div>
                  <div className="mt-2 text-secondary text-[11px] tracking-wide">
                    click to collapse
                  </div>
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Note panel */}
        {/* Note panel */}
<AnimatePresence>
  {active !== null && (
    <motion.div
      key="note"
      className="absolute left-1/2 bottom-6 z-[40] -translate-x-1/2 w-[min(720px,92%)]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md px-6 py-6 min-h-[140px]">
        {/* Title */}
        <div className="text-white text-[14px] tracking-wide leading-snug">
          {INTERESTS[active].title}
        </div>

        {/* Note: wraps, and is visually limited to ~2 lines */}
        <div
          className="mt-4 text-secondary text-[13px] leading-relaxed whitespace-normal break-words"
          
        >
          {(() => {
                  const note = String(INTERESTS[active]?.note || "");
                  const mid = Math.floor(note.length / 2);
                  let i = note.lastIndexOf(" ", mid);
                  if (i < 10) i = note.indexOf(" ", mid);
                  if (i === -1) return note;

                const line1 = note.slice(0, i).trim();
                const line2 = note.slice(i + 1).trim();

                return (
                    <>
                      {line1}
                      <br />
                      {line2}
                    </>
                  );
                })()}
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

      </div>
    </div>
  );
}

const Feedbacks = () => {
  return (
    <div className="mt-12 bg-black-100 rounded-[20px] overflow-hidden">
      <div className={`bg-tertiary rounded-2xl ${styles.padding} min-h-[220px]`}>
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>Additionally, some other foundations</p>
          <h2 className={styles.sectionHeadText}>Orbits of Interest.</h2>
          <p className="mt-4 text-secondary max-w-2xl leading-relaxed">
            A few recurring interests. Click one for a short note.
          </p>
        </motion.div>
      </div>

      <motion.div
        variants={fadeIn("", "", 0.1, 0.9)}
        className={`mt-6 pb-12 ${styles.paddingX}`}
      >
        <div className="rounded-2xl bg-black/25 border border-white/5 overflow-hidden">
          <div className="px-4 sm:px-8 py-8">
            <OrbitInterests />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Feedbacks, "");
