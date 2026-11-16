"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { PreviewKey } from "@/data/projects";

/**
 * One small animated scene per project, drawn in code so there is something
 * to look at before real screenshots exist. Each fills its parent.
 * To add a new one: write a component, then add it to `previews` below.
 */

function useTick(ms: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setN((v) => v + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return n;
}

/* RescueTime: requests travelling between services. */
function ApiPreview() {
  const hub = { x: 100, y: 62 };
  const nodes = [
    { x: 24, y: 22, t: "GET" },
    { x: 178, y: 26, t: "POST" },
    { x: 30, y: 104, t: "auth" },
    { x: 172, y: 100, t: "sync" },
    { x: 100, y: 114, t: "webhook" },
  ];
  return (
    <svg viewBox="0 0 200 125" className="h-full w-full bg-spruce" preserveAspectRatio="xMidYMid slice">
      {nodes.map((n, i) => (
        <g key={i}>
          <line x1={n.x} y1={n.y} x2={hub.x} y2={hub.y} stroke="#a9bda0" strokeWidth=".4" strokeDasharray="1.5 2" />
          <motion.circle
            r="1.8"
            fill="#ff4f9a"
            initial={{ cx: n.x, cy: n.y }}
            animate={i % 2 ? { cx: [hub.x, n.x], cy: [hub.y, n.y] } : { cx: [n.x, hub.x], cy: [n.y, hub.y] }}
            transition={{ duration: 1.6, delay: i * 0.45, repeat: Infinity, repeatDelay: 0.9, ease: "easeInOut" }}
          />
          <rect x={n.x - 13} y={n.y - 5} width="26" height="10" rx="5" fill="#0b2a20" stroke="#a9bda0" strokeWidth=".4" />
          <text x={n.x} y={n.y + 1.9} textAnchor="middle" fontSize="5" fill="#e4ebe6" fontFamily="var(--font-mono)">
            {n.t}
          </text>
        </g>
      ))}
      <motion.circle
        cx={hub.x}
        cy={hub.y}
        r="13"
        fill="none"
        stroke="#ff4f9a"
        strokeWidth=".5"
        animate={{ r: [13, 19], opacity: [0.8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <circle cx={hub.x} cy={hub.y} r="13" fill="#e4ebe6" />
      <text x={hub.x} y={hub.y + 2.4} textAnchor="middle" fontSize="7" fontWeight="800" fill="#0a1f18" fontFamily="var(--font-display)">
        API
      </text>
    </svg>
  );
}

/* ResumeIQ: candidates re-rank as scores come in. */
function RankPreview() {
  const tick = useTick(2400);
  const [rows, setRows] = useState(() =>
    ["A", "B", "C", "D", "E"].map((id, i) => ({ id, score: 92 - i * 11 })),
  );
  useEffect(() => {
    if (tick === 0) return;
    setRows((r) =>
      r.map((x) => ({ ...x, score: 38 + Math.round(Math.random() * 60) })).sort((a, b) => b.score - a.score),
    );
  }, [tick]);
  return (
    <div className="flex h-full w-full flex-col justify-center gap-[5%] bg-fog px-[8%] text-ink">
      {rows.map((r, i) => (
        <motion.div key={r.id} layout transition={{ type: "spring", stiffness: 140, damping: 20 }} className="flex items-center gap-3">
          <span className="w-24 shrink-0 font-display text-sm font-semibold md:text-base">Candidate {r.id}</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-ink/10 md:h-4">
            <motion.div
              className={`h-full rounded-full ${i === 0 ? "bg-flag" : "bg-ink"}`}
              animate={{ width: `${r.score}%` }}
              transition={{ type: "spring", stiffness: 70, damping: 18 }}
            />
          </div>
          <span className="w-8 text-right font-mono text-sm tabular-nums">{r.score}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* Colorectal Cancer CNN: a window scans image patches. */
function CnnPreview() {
  const n = 6;
  const tick = useTick(420);
  const at = tick % (n * n);
  return (
    <div className="relative grid h-full w-full place-items-center bg-pine p-[9%]">
      <div className="grid aspect-square w-full gap-[3px]" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {Array.from({ length: n * n }, (_, i) => (
          <div
            key={i}
            className="relative rounded-[3px] transition-[outline-color] duration-200"
            style={{
              background: `hsl(${318 + ((i * 37) % 34)} ${28 + ((i * 13) % 22)}% ${26 + ((i * 53) % 34)}%)`,
              outline: "2px solid",
              outlineColor: i === at ? "#ff4f9a" : "transparent",
              outlineOffset: 2,
              opacity: i <= at ? 1 : 0.45,
            }}
          />
        ))}
      </div>
      <div className="absolute bottom-[4%] left-[9%] right-[9%] flex justify-between font-mono text-xs text-fog md:text-sm">
        <span className="tabular-nums">
          patch {String(at + 1).padStart(2, "0")} of {n * n}
        </span>
        <span>97% accuracy</span>
      </div>
    </div>
  );
}

/* EcoCrafts: a sprout that keeps growing. */
function EcoPreview() {
  const leaf = "M0 0 C 14 -16, 34 -14, 40 0 C 30 12, 12 12, 0 0 Z";
  const leaves = [
    { x: 100, y: 108, r: -18, s: 1, d: 0.5 },
    { x: 100, y: 92, r: 198, s: 0.9, d: 0.9 },
    { x: 99, y: 72, r: -30, s: 0.75, d: 1.3 },
    { x: 99, y: 58, r: 210, s: 0.6, d: 1.6 },
  ];
  const loop = { duration: 4.5, repeat: Infinity, repeatDelay: 1.2, times: [0, 0.45, 0.85, 1] };
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" style={{ background: "#c6d8bb" }}>
      <ellipse cx="100" cy="150" rx="46" ry="7" fill="#0a1f18" opacity=".18" />
      <motion.path
        d="M100 150 C 104 118, 94 88, 100 40"
        fill="none"
        stroke="#12372a"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 1 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={loop}
      />
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`}>
          <motion.path
            d={leaf}
            fill={i === 3 ? "#ff4f9a" : "#12372a"}
            initial={{ scale: 1 }}
            animate={{ scale: [0, 1, 1, 0] }}
            transition={{ ...loop, delay: l.d * 0.4 }}
            style={{ transformOrigin: "0px 0px" }}
          />
        </g>
      ))}
    </svg>
  );
}

/* BizzBloom: desks on a floor plan get booked and freed. */
function SpacePreview() {
  const cols = 8;
  const total = cols * 4;
  const tick = useTick(650);
  const [booked, setBooked] = useState<number[]>([1, 4, 5, 11, 14, 18, 22, 23, 27, 30]);
  useEffect(() => {
    if (tick === 0) return;
    const i = Math.floor(Math.random() * total);
    setBooked((b) => (b.includes(i) ? b.filter((x) => x !== i) : [...b, i]));
  }, [tick, total]);
  return (
    <div className="flex h-full w-full flex-col justify-center gap-[6%] bg-spruce px-[7%]">
      <div className="grid gap-[6px] md:gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: total }, (_, i) => {
          const on = booked.includes(i);
          return (
            <motion.div
              key={i}
              className="aspect-[4/3] rounded-[4px] border border-lichen/60"
              animate={{ backgroundColor: on ? "#ff4f9a" : "rgba(255,79,154,0)", scale: on ? 1 : 0.92 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            />
          );
        })}
      </div>
      <p className="flex justify-between font-display text-sm font-semibold text-fog md:text-base">
        <span>
          <span className="tabular-nums">{total - booked.length}</span> desks open
        </span>
        <span className="text-flag">
          <span className="tabular-nums">{booked.length}</span> booked
        </span>
      </p>
    </div>
  );
}

/* ASL Flashcards: a card that flips through letters. */
function AslPreview() {
  const letters = ["A", "S", "L"];
  const tick = useTick(1500);
  const flipped = tick % 2 === 1;
  const letter = letters[Math.floor(tick / 2) % letters.length];
  return (
    <div className="grid h-full w-full place-items-center bg-fog" style={{ perspective: 900 }}>
      <motion.div
        className="relative aspect-[3/4] w-[46%]"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 60, damping: 13 }}
      >
        <div
          className="absolute inset-0 grid place-items-center rounded-2xl bg-ink text-fog shadow-[0_18px_0_-8px_rgba(10,31,24,.25)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="display text-[clamp(4rem,12vw,9rem)]">{letter}</span>
        </div>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-flag p-4 text-center text-ink"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="h-1/2 w-2/3 rounded-xl border-2 border-dashed border-ink/50" />
          <span className="font-display text-sm font-semibold md:text-base">Hand shape for {letter}</span>
        </div>
      </motion.div>
    </div>
  );
}

const previews: Record<PreviewKey, () => React.JSX.Element> = {
  api: ApiPreview,
  rank: RankPreview,
  cnn: CnnPreview,
  eco: EcoPreview,
  space: SpacePreview,
  asl: AslPreview,
};

export default function Preview({ kind }: { kind: PreviewKey }) {
  const P = previews[kind];
  return (
    <div className="h-full w-full" aria-hidden>
      <P />
    </div>
  );
}
