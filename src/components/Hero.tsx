"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { site } from "@/data/site";
import { Letters } from "./ui";

// The 3D scene loads after the text, so the name paints immediately.
const Terrain = dynamic(() => import("./Scene3D").then((m) => m.Terrain), { ssr: false });

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const left = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const right = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const sink = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-pine px-5 pb-8 pt-28 md:px-10 md:pb-10">
      <motion.div style={{ y: sink }} className="absolute inset-0">
        <Terrain />
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-pine to-transparent" aria-hidden />

      <h1 className="display relative text-[clamp(4.6rem,20.5vw,21rem)]">
        <motion.span style={{ x: left }} className="block">
          <Letters text={site.firstName} delay={0.15} />
        </motion.span>
        <motion.span style={{ x: right }} className="-mt-[0.1em] block text-right md:pr-[3vw]">
          <Letters text={site.lastName} delay={0.4} />
        </motion.span>
      </h1>

      <motion.div
        style={{ opacity: fade }}
        className="relative mt-6 flex flex-col justify-between gap-6 md:mt-10 md:flex-row md:items-end"
      >
        <motion.p
          className="max-w-[26ch] text-2xl leading-snug md:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 60, damping: 16 }}
        >
          {site.tagline}
        </motion.p>
        <motion.p
          className="hidden text-base italic text-lichen md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          Move your pointer. The ground follows it.
        </motion.p>
      </motion.div>
    </section>
  );
}
