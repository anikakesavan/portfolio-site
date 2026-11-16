"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import type { Project } from "@/data/projects";
import { site } from "@/data/site";
import Preview from "./Previews";
import { Letters, TLink } from "./ui";

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-fog/25 py-4">
      <dt className="text-base italic text-lichen">{label}</dt>
      <dd className="mt-1 font-display text-xl font-semibold">{children}</dd>
    </div>
  );
}

export default function CaseStudy({ project, next }: { project: Project; next: Project }) {
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.88, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.5], [48, 0]);
  const drafts = site.showDrafts;

  return (
    <article className="bg-pine">
      <header className="px-5 pb-12 pt-32 md:px-10 md:pb-20 md:pt-44">
        <TLink href="/#work" className="font-display font-bold underline decoration-flag decoration-2 underline-offset-[6px]">
          All work
        </TLink>
        <p className="mt-10 text-2xl italic text-lichen md:text-3xl">{project.kind}</p>
        <h1 className="display mt-3 text-[clamp(3.6rem,14vw,15rem)]">
          {project.title.split(" ").map((w, i) => (
            <span key={i}>
              <Letters text={w} delay={0.25 + i * 0.12} />{" "}
            </span>
          ))}
        </h1>
      </header>

      <div ref={stage} className="px-5 md:px-10">
        <motion.div style={{ scale, borderRadius: radius }} className="aspect-[4/3] overflow-hidden md:aspect-[16/8]">
          <Preview kind={project.preview} />
        </motion.div>
      </div>

      <div className="grid gap-12 px-5 py-20 md:grid-cols-12 md:px-10 md:py-32">
        <dl className="md:col-span-4">
          {project.role && <Fact label="Role">{project.role}</Fact>}
          {project.period && <Fact label="When">{project.period}</Fact>}
          {project.recognition && <Fact label="Result">{project.recognition}</Fact>}
          {project.stack.length > 0 && <Fact label="Built with">{project.stack.join(", ")}</Fact>}
          {project.links?.map((l) => (
            <Fact key={l.href} label="Link">
              <TLink href={l.href} className="underline decoration-flag decoration-2 underline-offset-4">
                {l.label}
              </TLink>
            </Fact>
          ))}
        </dl>

        <div className="md:col-span-7 md:col-start-6">
          {project.overview.map((p, i) => (
            <p key={i} className={i === 0 ? "text-2xl leading-snug md:text-4xl md:leading-[1.2]" : "mt-6 max-w-[60ch] text-xl"}>
              {p}
            </p>
          ))}

          {project.images?.map((img) => (
            <Image key={img.src} src={img.src} alt={img.alt} width={1600} height={1000} sizes="(min-width: 768px) 58vw, 100vw" className="mt-12 h-auto w-full rounded-xl" />
          ))}

          {drafts && (
            <aside className="mt-14 rounded-xl border-2 border-dashed border-flag/70 p-6">
              <h2 className="font-display text-xl font-bold text-flag">Still to add (hidden when showDrafts is false)</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                {project.todo?.map((t) => <li key={t}>{t}</li>)}
                {!project.images?.length && (
                  <li>
                    Screenshots go in <code className="font-mono text-base">public/work/</code>, then list them under{" "}
                    <code className="font-mono text-base">images</code> in <code className="font-mono text-base">projects.ts</code>.
                  </li>
                )}
              </ul>
              <div className="mt-6 grid aspect-[16/9] place-items-center rounded-lg bg-fog/10 text-center italic text-lichen">
                Image placeholder
              </div>
            </aside>
          )}
        </div>
      </div>

      <TLink
        href={`/work/${next.slug}/`}
        data-cursor="Next"
        className="block bg-fog px-5 py-20 text-ink md:px-10 md:py-32"
      >
        <span className="text-2xl italic">Next project</span>
        <span className="display stretch mt-3 block text-[clamp(3.2rem,12vw,13rem)]">{next.title}</span>
      </TLink>
    </article>
  );
}
