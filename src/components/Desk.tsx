"use client";

import { motion, useDragControls } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { experience, skills } from "@/data/content";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { usePageTransition } from "./Providers";
import { Letters, TLink } from "./ui";

/**
 * The signature piece: a small desktop. Windows drag by their title bars,
 * and the terminal takes real commands (try "help").
 * On phones the windows stack in a column and stay put.
 */

function useIsDesktop() {
  const [is, setIs] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const set = () => setIs(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return is;
}

function Win({
  title,
  bounds,
  desktop,
  pos,
  width,
  tone = "fog",
  z,
  onFocus,
  children,
}: {
  title: string;
  bounds: RefObject<HTMLDivElement | null>;
  desktop: boolean;
  pos: { left: string; top: string };
  width: number;
  tone?: "fog" | "pine" | "flag";
  z: number;
  onFocus: () => void;
  children: ReactNode;
}) {
  const controls = useDragControls();
  const tones = {
    fog: "bg-fog text-ink",
    pine: "bg-pine text-fog",
    flag: "bg-flag text-ink",
  };
  return (
    <motion.section
      aria-label={title}
      drag={desktop}
      dragControls={controls}
      dragListener={false}
      dragConstraints={bounds}
      dragMomentum={false}
      dragElastic={0.08}
      whileDrag={{ scale: 1.02, rotate: -0.6 }}
      onPointerDown={onFocus}
      style={desktop ? { position: "absolute", ...pos, width, zIndex: z } : undefined}
      className={`overflow-hidden rounded-xl border border-ink/70 shadow-[10px_12px_0_0_rgba(10,31,24,.35)] ${tones[tone]}`}
    >
      <div
        data-cursor={desktop ? "Drag" : undefined}
        onPointerDown={(e) => desktop && controls.start(e)}
        className={`flex touch-none select-none items-center gap-2 border-b border-current/25 px-3 py-2 font-display text-sm font-bold ${desktop ? "cursor-grab active:cursor-grabbing" : ""}`}
      >
        <span aria-hidden className="h-3 w-3 rounded-full border border-current" />
        <span aria-hidden className="h-3 w-3 rounded-full border border-current" />
        <span className="ml-2">{title}</span>
      </div>
      {children}
    </motion.section>
  );
}

type Line = { kind: "in" | "out"; text: string };

function Terminal() {
  const { navigate } = usePageTransition();
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: `${site.name}, portfolio shell` },
    { kind: "out", text: 'Type "help" and press Enter.' },
  ]);
  const [value, setValue] = useState("");
  const [past, setPast] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines]);

  const run = (raw: string): string[] | null => {
    const [cmd, ...rest] = raw.trim().split(/\s+/);
    const arg = rest.join(" ").toLowerCase();
    switch (cmd.toLowerCase()) {
      case "help":
        return [
          "about        who this is",
          "ls           list projects",
          "open <name>  open a case study, e.g. open resumeiq",
          "experience   where I have worked",
          "skills       what I work with",
          "contact      how to reach me",
          "clear        wipe the screen",
        ];
      case "about":
      case "whoami":
        return [site.tagline];
      case "ls":
      case "work":
      case "projects":
        return projects.map((p) => `${p.slug.padEnd(24)}${p.kind}`);
      case "open":
      case "cd": {
        const hit = projects.find(
          (p) => p.slug === arg || p.slug.startsWith(arg) || p.title.toLowerCase() === arg,
        );
        if (!arg || !hit) return [`No project called "${arg}". Type ls to see the names.`];
        navigate(`/work/${hit.slug}/`);
        return [`Opening ${hit.title}...`];
      }
      case "experience":
        return experience.map((r) => `${r.org}: ${r.title}`);
      case "skills":
        return skills.map((g) => `${g.group}: ${g.items.join(", ")}`);
      case "contact":
        return [...(site.email ? [site.email] : []), ...site.links.map((l) => `${l.label}: ${l.href}`)];
      case "clear":
        return null;
      case "sudo":
        return ["Nice try."];
      case "":
        return [];
      default:
        return [`Command not found: ${cmd}. Type help to see what works.`];
    }
  };

  return (
    <form
      className="font-mono text-[13px] leading-relaxed"
      onSubmit={(e) => {
        e.preventDefault();
        const out = run(value);
        setLines((l) =>
          out === null
            ? []
            : [...l, { kind: "in", text: value }, ...out.map((text) => ({ kind: "out" as const, text }))],
        );
        if (value.trim()) setPast((p) => [value, ...p]);
        setCursor(-1);
        setValue("");
      }}
    >
      <div ref={scroller} data-lenis-prevent className="h-56 overflow-y-auto px-4 pt-3" role="log" aria-live="polite" tabIndex={0}>
        {lines.map((l, i) => (
          <p key={i} className={`whitespace-pre-wrap break-words ${l.kind === "in" ? "text-flag" : "text-fog/90"}`}>
            {l.kind === "in" ? `> ${l.text}` : l.text}
          </p>
        ))}
      </div>
      <label className="flex items-center gap-2 px-4 pb-4 pt-2 text-flag">
        <span aria-hidden>&gt;</span>
        <span className="sr-only">Terminal command</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" && past.length) {
              e.preventDefault();
              const n = Math.min(cursor + 1, past.length - 1);
              setCursor(n);
              setValue(past[n]);
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              const n = Math.max(cursor - 1, -1);
              setCursor(n);
              setValue(n === -1 ? "" : past[n]);
            }
          }}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="help"
          className="w-full bg-transparent text-fog caret-flag outline-none placeholder:text-fog/30"
        />
      </label>
    </form>
  );
}

export default function Desk() {
  const bounds = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();
  const [order, setOrder] = useState(["note", "climate", "files", "term"]);
  const focus = (id: string) => setOrder((o) => [...o.filter((x) => x !== id), id]);
  const z = (id: string) => 10 + order.indexOf(id);
  const common = (id: string) => ({ bounds, desktop, z: z(id), onFocus: () => focus(id) });

  return (
    <section id="desk" className="bg-spruce px-5 py-24 md:px-10 md:py-36">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="display text-[clamp(3.6rem,13vw,13rem)]">
          <Letters text="The desk" onView />
        </h2>
        <p className="max-w-[30ch] pb-3 text-xl">
          A working desktop. Drag the windows by their title bars. The terminal runs real commands.
        </p>
      </div>

      <div
        ref={bounds}
        className="relative mt-12 flex flex-col gap-6 rounded-[1.5rem] border border-fog/25 p-4 [background-image:radial-gradient(rgba(228,235,230,.16)_1px,transparent_1px)] [background-size:22px_22px] md:mt-16 min-[900px]:block min-[900px]:h-[640px] min-[900px]:p-0"
      >
        <Win title="terminal" tone="pine" pos={{ left: "5%", top: "9%" }} width={540} {...common("term")}>
          <Terminal />
        </Win>

        <Win title="work/" pos={{ left: "56%", top: "6%" }} width={330} {...common("files")}>
          <ul className="p-2">
            {projects.map((p) => (
              <li key={p.slug}>
                <TLink
                  href={`/work/${p.slug}/`}
                  className="flex items-center justify-between gap-3 rounded-md px-3 py-2 font-display font-semibold hover:bg-ink hover:text-fog focus-visible:bg-ink focus-visible:text-fog"
                >
                  <span>{p.title}</span>
                  <span className="font-serif text-sm font-normal italic opacity-70">{p.kind.split(" ").slice(-1)}</span>
                </TLink>
              </li>
            ))}
          </ul>
        </Win>

        <Win title="climate.txt" pos={{ left: "38%", top: "58%" }} width={380} {...common("climate")}>
          <p className="p-4 text-base leading-relaxed">
            Citizens&rsquo; Climate Lobby, Washington Youth Leadership. Climate advocacy, legislative outreach, and
            organizing student initiatives.
          </p>
        </Win>

        <Win title="note" tone="flag" pos={{ left: "76%", top: "60%" }} width={210} {...common("note")}>
          <p className="p-4 font-display text-xl font-bold leading-tight">
            Try typing
            <br />
            open resumeiq
            <br />
            in the terminal.
          </p>
        </Win>
      </div>
    </section>
  );
}
