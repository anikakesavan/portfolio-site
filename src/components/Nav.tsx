"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { sections, site } from "@/data/site";
import { lenisRef } from "./Providers";
import { Magnetic, TLink, useSectionHref } from "./ui";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const sectionHref = useSectionHref();

  useEffect(() => setOpen(false), [pathname]);

  // While the menu is open: pause page scroll, close on Escape, keep Tab inside.
  useEffect(() => {
    if (!open) return;
    lenisRef.current?.stop();
    document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("a");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key !== "Tab" || !panel.current) return;
      const items = [
        toggle.current!,
        ...panel.current.querySelectorAll<HTMLElement>("a,button"),
      ];
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? i - 1 : i + 1;
      if (next < 0 || next >= items.length || i === -1) {
        e.preventDefault();
        items[next < 0 ? items.length - 1 : 0].focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenisRef.current?.start();
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[110] flex items-center justify-between px-5 py-4 text-white mix-blend-difference md:px-10 md:py-6">
        <TLink
          href="/"
          className="pointer-events-auto font-display text-lg font-bold tracking-tight"
          aria-label={`${site.name}, home`}
        >
          {site.firstName} K.
        </TLink>
        <Magnetic>
          <button
            ref={toggle}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
            className="pointer-events-auto flex items-center gap-3 px-2 py-2 font-display text-lg font-bold"
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span aria-hidden className="relative block h-3 w-8">
              <motion.span
                className="absolute left-0 top-0 block h-[2px] w-8 bg-current"
                animate={open ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 }}
              />
              <motion.span
                className="absolute bottom-0 left-0 block h-[2px] w-8 bg-current"
                animate={open ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }}
              />
            </span>
          </button>
        </Magnetic>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[105] flex flex-col justify-between overflow-y-auto bg-flag px-5 pb-8 pt-24 text-ink md:px-10 md:pt-28"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Sections">
              <ul>
                {sections.map((s, i) => (
                  <li key={s.id} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{ type: "spring", stiffness: 90, damping: 17, delay: 0.18 + i * 0.06 }}
                    >
                      <TLink
                        href={sectionHref(s.id)}
                        onClick={() => setOpen(false)}
                        className="display block py-1 text-[clamp(3.2rem,11vw,9rem)]"
                      >
                        <span className="stretch inline-block">{s.label}</span>
                      </TLink>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-10 flex flex-wrap items-end justify-between gap-4 text-lg">
              {site.email ? (
                <a href={`mailto:${site.email}`} className="underline underline-offset-4">
                  {site.email}
                </a>
              ) : (
                <span>{site.tagline}</span>
              )}
              <ul className="flex gap-6">
                {site.links.map((l) => (
                  <li key={l.label}>
                    <TLink href={l.href} className="underline underline-offset-4">
                      {l.label}
                    </TLink>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
