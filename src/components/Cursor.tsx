"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * A pink dot that follows the pointer. It grows over links and buttons, and
 * shows a word over anything with a data-cursor="Word" attribute.
 * Off on touch screens and when reduced motion is requested.
 */
export default function Cursor() {
  const [on, setOn] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 42, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 600, damping: 42, mass: 0.35 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setOn(true);
    document.documentElement.classList.add("custom-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as Element | null)?.closest?.("[data-cursor],a,button");
      setLabel(el ? (el.getAttribute("data-cursor") ?? "") : null);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [x, y]);

  if (!on) return null;
  const size = label === null ? 14 : label ? 92 : 46;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[120]"
    >
      <motion.div
        animate={{ width: size, height: size, opacity: label === "" ? 0.55 : 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-flag font-display text-sm font-bold text-ink ring-1 ring-ink/25"
      >
        {label}
      </motion.div>
    </motion.div>
  );
}
