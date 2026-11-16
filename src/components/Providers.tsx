"use client";

import { MotionConfig, motion } from "framer-motion";
import Lenis from "lenis";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/** Shared handle so the menu can pause scrolling while it is open. */
export const lenisRef: { current: Lenis | null } = { current: null };

type Phase = "idle" | "cover" | "reveal";
const TransitionContext = createContext<{ navigate: (href: string) => void }>({
  navigate: () => {},
});
export const usePageTransition = () => useContext(TransitionContext);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const pending = useRef<string | null>(null);

  // Smooth scrolling. Skipped entirely when the visitor prefers less motion.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ anchors: true, lerp: 0.09 });
    lenisRef.current = lenis;
    let id = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // A new page has mounted: jump to the top and lift the curtain.
  useEffect(() => {
    if (!window.location.hash) {
      lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    }
    setPhase((p) => (p === "cover" ? "reveal" : p));
  }, [pathname]);

  const navigate = useCallback(
    (href: string) => {
      const path = href.split("#")[0] || "/";
      const here = pathname.replace(/\/$/, "") || "/";
      const there = path.replace(/\/$/, "") || "/";
      if (prefersReducedMotion() || here === there) {
        router.push(href);
        return;
      }
      pending.current = href;
      router.prefetch(href);
      setPhase("cover");
    },
    [pathname, router],
  );

  return (
    <MotionConfig reducedMotion="user">
      <TransitionContext.Provider value={{ navigate }}>
        {children}
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[150] bg-flag"
          initial={false}
          animate={phase}
          variants={{
            idle: { y: "100%", transition: { duration: 0 } },
            cover: { y: "0%", transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] } },
            reveal: {
              y: "-100%",
              transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1], delay: 0.1 },
            },
          }}
          onAnimationComplete={(def) => {
            if (def === "cover" && pending.current) {
              router.push(pending.current);
              pending.current = null;
            }
            if (def === "reveal") setPhase("idle");
          }}
        />
      </TransitionContext.Provider>
    </MotionConfig>
  );
}
