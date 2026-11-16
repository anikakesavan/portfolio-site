"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import {
  achievements,
  experience,
  interests,
  personal,
  places,
  skills,
  statement,
} from "@/data/content";
import { getProject, projects, type Project } from "@/data/projects";
import { site } from "@/data/site";
import Preview from "./Previews";
import { Letters, Magnetic, TLink } from "./ui";

const Globe = dynamic(() => import("./Scene3D").then((m) => m.Globe), { ssr: false });

const heading = "display text-[clamp(3.6rem,13vw,13rem)]";
const pad = "px-5 md:px-10";

/* ---------------- Statement: words fill in as you scroll ---------------- */

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = statement.split(" ");
  return (
    <section className={`bg-fog py-28 text-ink md:py-44 ${pad}`}>
      <p ref={ref} className="mx-auto max-w-[22ch] font-display text-[clamp(1.9rem,4.6vw,4.4rem)] font-semibold leading-[1.08] tracking-tight md:max-w-[30ch]">
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </p>
    </section>
  );
}

/* ---------------- Work ---------------- */

// Each project gets its own frame shape and column split.
const frames: Record<Project["preview"], { shape: string; span: string; text: string }> = {
  api: { shape: "aspect-[16/10]", span: "md:col-span-8", text: "md:col-span-4" },
  rank: { shape: "aspect-[4/3] rounded-[2rem]", span: "md:col-span-7", text: "md:col-span-5" },
  cnn: { shape: "aspect-square", span: "md:col-span-5", text: "md:col-span-7" },
  eco: { shape: "aspect-square rounded-full", span: "md:col-span-5", text: "md:col-span-7" },
  space: { shape: "aspect-[16/9] rounded-[0.5rem]", span: "md:col-span-8", text: "md:col-span-4" },
  asl: { shape: "aspect-[4/5] rounded-t-full", span: "md:col-span-4", text: "md:col-span-8" },
};

function ProjectSpread({ project, flip }: { project: Project; flip: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const f = frames[project.preview];
  return (
    <li ref={ref} className="border-t border-fog/20">
      <TLink
        href={`/work/${project.slug}/`}
        data-cursor="Open"
        className="grid items-end gap-x-10 gap-y-8 py-14 md:grid-cols-12 md:py-24"
      >
        <motion.div style={{ y }} className={`${f.span} ${flip ? "md:order-2" : ""}`}>
          <div className={`overflow-hidden ${f.shape}`}>
            <Preview kind={project.preview} />
          </div>
        </motion.div>
        <div className={`md:pb-4 ${f.text}`}>
          <p className="text-xl italic text-lichen">{project.kind}</p>
          <h3 className="display stretch mt-3 text-[clamp(2.8rem,6.2vw,6.5rem)]">{project.title}</h3>
          <p className="mt-5 max-w-[38ch]">{project.summary}</p>
          {project.stack.length > 0 && (
            <p className="mt-4 max-w-[38ch] font-display text-base font-medium text-lichen">
              {project.stack.join(", ")}
            </p>
          )}
          <p className="mt-6 font-display font-bold text-flag underline decoration-2 underline-offset-[6px]">
            Read the case study
          </p>
        </div>
      </TLink>
    </li>
  );
}

export function Work() {
  return (
    <section id="work" className={`bg-pine py-24 md:py-36 ${pad}`}>
      <h2 className={heading}>
        <Letters text="Selected" onView /> <Letters text="work" onView delay={0.2} />
      </h2>
      <ul className="mt-14 md:mt-24">
        {projects.map((p, i) => (
          <ProjectSpread key={p.slug} project={p} flip={i % 2 === 1} />
        ))}
      </ul>
    </section>
  );
}

/* ---------------- About: pick an interest, read the story ---------------- */

export function About() {
  const [active, setActive] = useState(0);
  const current = interests[active];
  return (
    <section id="about" className={`bg-fog py-24 text-ink md:py-36 ${pad}`}>
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className={`${heading} md:sticky md:top-28`}>
            <Letters text="About" onView />
          </h2>
        </div>
        <div className="md:col-span-7">
          <p className="max-w-[34ch] text-2xl leading-snug md:text-3xl">
            I&rsquo;m Anika. Five things keep pulling me back in. Pick one.
          </p>
          <ul className="mt-10 border-b border-ink/20">
            {interests.map((it, i) => {
              const on = i === active;
              return (
                <li key={it.title} className="border-t border-ink/20">
                  <button
                    type="button"
                    aria-expanded={on}
                    onClick={() => setActive(i)}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                    onFocus={() => setActive(i)}
                    className="flex w-full items-baseline justify-between gap-4 py-4 text-left md:py-5"
                  >
                    <span className={`display stretch text-[clamp(2.2rem,5.6vw,5.5rem)] ${on ? "is-active" : "text-ink/35"}`}>
                      {it.title}
                    </span>
                    <motion.span
                      aria-hidden
                      className="block h-4 w-4 shrink-0 rounded-full bg-flag"
                      animate={{ scale: on ? 1 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[46ch] pb-3 text-xl">{current.body}</p>
                        <p className="flex flex-wrap gap-x-6 pb-6 font-display font-bold">
                          {current.related?.map((slug) => {
                            const p = getProject(slug);
                            return p ? (
                              <TLink key={slug} href={`/work/${slug}/`} className="underline decoration-flag decoration-[3px] underline-offset-4">
                                {p.title}
                              </TLink>
                            ) : null;
                          })}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Experience: a line that draws as you scroll ---------------- */

export function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  const [open, setOpen] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.55"] });
  return (
    <section id="experience" className={`bg-fog py-24 text-ink md:py-36 ${pad}`}>
      <h2 className={heading}>
        <Letters text="Experience" onView />
      </h2>
      <ol ref={ref} className="relative mt-14 md:ml-[16.6%] md:mt-24">
        <span aria-hidden className="absolute bottom-0 left-[7px] top-0 w-[2px] bg-ink/15" />
        <motion.span aria-hidden style={{ scaleY: scrollYProgress }} className="absolute bottom-0 left-[7px] top-0 w-[2px] origin-top bg-flag" />
        {experience.map((role, i) => {
          const on = open === i;
          return (
            <li key={role.org} className="relative pb-10 pl-10 md:pb-14 md:pl-16">
              <motion.span
                aria-hidden
                className="absolute left-0 top-3 block h-4 w-4 rounded-full border-2 border-ink bg-fog md:top-5"
                animate={{ backgroundColor: on ? "#ff4f9a" : "#e4ebe6", scale: on ? 1.25 : 1 }}
              />
              <button type="button" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)} className="block w-full text-left">
                <span className={`display stretch block text-[clamp(2.2rem,5.4vw,5.2rem)] ${on ? "is-active" : ""}`}>{role.org}</span>
                <span className="mt-2 block text-xl italic md:text-2xl">
                  {role.title}
                  {role.period ? `, ${role.period}` : ""}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    className="overflow-hidden"
                  >
                    {role.points.map((pt) => (
                      <li key={pt} className="max-w-[52ch] pt-3 text-lg first:pt-5">
                        {pt}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ---------------- Skills: rows that slide with the scroll ---------------- */

function SkillRow({ group, items, progress, dir }: { group: string; items: string[]; progress: MotionValue<number>; dir: 1 | -1 }) {
  const x = useTransform(progress, [0, 1], dir === 1 ? ["2%", "-22%"] : ["-22%", "2%"]);
  return (
    <div className="border-t border-fog/20 py-5 md:py-7">
      <h3 className={`text-lg italic text-lichen ${pad}`}>{group}</h3>
      <motion.ul style={{ x }} className="mt-2 flex w-max gap-x-[0.5em] whitespace-nowrap pl-5 text-[clamp(2.6rem,7.5vw,7rem)] md:pl-10">
        {items.map((s) => (
          <li key={s} className="display transition-colors duration-200 hover:text-flag">
            {s}
            <span aria-hidden className="ml-[0.5em] inline-block h-[0.18em] w-[0.18em] rounded-full bg-flag align-middle" />
          </li>
        ))}
      </motion.ul>
    </div>
  );
}

export function Skills() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return (
    <section ref={ref} className="overflow-hidden bg-pine py-24 md:py-36">
      <h2 className={`${heading} ${pad} mb-12 md:mb-20`}>
        <Letters text="Toolkit" onView />
      </h2>
      {skills.map((g, i) => (
        <SkillRow key={g.group} group={g.group} items={g.items} progress={scrollYProgress} dir={i % 2 ? -1 : 1} />
      ))}
    </section>
  );
}

/* ---------------- Achievements ---------------- */

function AchievementRow({ big, detail, delay }: { big: string; detail: string; delay: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  return (
    <li ref={ref} className="border-t border-ink/20">
      <motion.div
        className="grid items-baseline gap-x-10 gap-y-2 py-8 md:grid-cols-12 md:py-10"
        initial={false}
        animate={{ clipPath: seen ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay }}
      >
        <span className="display text-[clamp(3rem,9vw,9rem)] md:col-span-8">{big}</span>
        <span className="max-w-[30ch] text-xl md:col-span-4">{detail}</span>
      </motion.div>
    </li>
  );
}

export function Achievements() {
  return (
    <section className={`bg-fog py-24 text-ink md:py-36 ${pad}`}>
      <h2 className="text-2xl italic md:text-3xl">A few results I&rsquo;m proud of</h2>
      <ul className="mt-10">
        {achievements.map((a, i) => (
          <AchievementRow key={a.big} {...a} delay={i * 0.08} />
        ))}
      </ul>
    </section>
  );
}

/* ---------------- Off the clock: globe + interests ---------------- */

export function OffTheClock() {
  return (
    <section className={`bg-pine py-24 md:py-36 ${pad}`}>
      <div className="grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <h2 className="display text-[clamp(3.2rem,9vw,9rem)]">
            <Letters text="Off the" onView /> <Letters text="clock" onView delay={0.2} />
          </h2>
          <ul className="mt-10 border-b border-fog/20">
            {personal.map((p) => (
              <li key={p} className="border-t border-fog/20 py-4 font-display text-2xl font-semibold md:text-3xl">
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <Globe places={places} />
          <p className="mt-2 text-center text-xl">
            Home so far: {places.map((p) => p.name).join(", ")}.
            <span className="mt-1 block text-base italic text-lichen">Drag the globe to find the pins.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */

export function Contact() {
  const linkedin = site.links.find((l) => l.label === "LinkedIn") ?? site.links[0];
  const primary = site.email
    ? { href: `mailto:${site.email}`, label: "Email me" }
    : { href: linkedin.href, label: `Message me` };
  return (
    <section id="contact" className={`relative overflow-hidden bg-flag pb-10 pt-24 text-ink md:pt-36 ${pad}`}>
      <h2 className="display text-[clamp(4.4rem,19vw,20rem)]">
        <Letters text="Say" onView /> <Letters text="hello" onView delay={0.15} />
      </h2>
      <div className="mt-10 flex flex-col gap-10 md:mt-16 md:flex-row md:items-center md:justify-between">
        <p className="max-w-[30ch] text-2xl leading-snug md:text-3xl">
          Internships, collaborations, climate work, or a question about anything here.{" "}
          {site.email ? "Email is the fastest way to reach me." : `${linkedin.label} is the fastest way to reach me.`}
        </p>
        <Magnetic strength={0.45}>
          <a
            href={primary.href}
            {...(site.email ? {} : { target: "_blank", rel: "noreferrer" })}
            data-cursor=""
            className="grid h-44 w-44 place-items-center rounded-full bg-ink text-center font-display text-2xl font-bold text-fog transition-transform duration-300 hover:scale-105 md:h-56 md:w-56 md:text-3xl"
          >
            {primary.label}
          </a>
        </Magnetic>
      </div>
      {site.email && <p className="mt-10 select-all font-display text-xl font-semibold md:text-2xl">{site.email}</p>}
      <footer className="mt-16 flex flex-wrap items-end justify-between gap-6 border-t border-ink/30 pt-6 font-display text-lg font-semibold">
        <ul className="flex gap-8">
          {site.links.map((l) => (
            <li key={l.label}>
              <Magnetic>
                <TLink href={l.href} className="inline-block py-2 underline decoration-2 underline-offset-[6px]">
                  {l.label}
                </TLink>
              </Magnetic>
            </li>
          ))}
        </ul>
        <p className="font-serif text-base font-normal">
          {site.name}, {new Date().getFullYear()}
        </p>
      </footer>
    </section>
  );
}
