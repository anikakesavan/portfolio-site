"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRef, type ComponentProps, type ReactNode } from "react";
import { usePageTransition } from "./Providers";

/**
 * Link with the pink curtain transition between pages. Hash links and
 * outside links behave like normal anchors.
 */
export function TLink({ href, onClick, ...rest }: ComponentProps<"a"> & { href: string }) {
  const { navigate } = usePageTransition();
  const external = /^(https?:|mailto:|tel:)/.test(href);
  // The visible href carries the base path so "open in new tab" also works
  // when the site is served from a subfolder such as GitHub Pages.
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return (
    <a
      href={href.startsWith("/") ? `${base}${href}` : href}
      {...(external && href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        if (external || href.startsWith("#")) return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    />
  );
}

/** Section link that works from any page: "#work" at home, "/#work" elsewhere. */
export function useSectionHref() {
  const pathname = usePathname();
  const home = pathname === "/" || pathname === "";
  return (id: string) => (home ? `#${id}` : `/#${id}`);
}

/** Pulls its child toward the pointer, then springs back. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 14, mass: 0.4 });
  return (
    <motion.div
      className={className}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Letters rise into place one by one. Screen readers get the plain word. */
export function Letters({
  text,
  delay = 0,
  onView = false,
  className = "",
}: {
  text: string;
  delay?: number;
  onView?: boolean;
  className?: string;
}) {
  // Watch the wrapper, not the letters: the letters start clipped out of
  // sight, and an observer never reports a fully clipped element as visible.
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const show = !onView || seen;
  return (
    <span ref={ref} className={`inline-block overflow-hidden pb-[0.12em] pt-[0.06em] ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-block whitespace-pre">
        {[...text].map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ y: "115%" }}
            animate={{ y: show ? "0%" : "115%" }}
            transition={{ type: "spring", stiffness: 110, damping: 18, delay: delay + i * 0.04 }}
          >
            {ch}
          </motion.span>
        ))}
      </span>
    </span>
  );
}
