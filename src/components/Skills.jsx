import { useState } from "react";
import { motion } from "framer-motion";
import { Reveal, SectionHead } from "./Reveal";
import { gradients, currentTheme } from "@/data/gradients";

const theme = gradients[currentTheme];

const skills = [
  { name: "Luau", note: "Strict typing, metatables, coroutines and Parallel Luau." },
  { name: "OOP", note: "Class hierarchies, composition and clean module boundaries." },
  { name: "ProfileService", note: "Session-locked saves, reconciliation and migrations." },
  { name: "UI/GUI", note: "Responsive, tweened interfaces for PC, mobile and console." },
  { name: "Data Systems", note: "DataStores, MemoryStore queues and replicated state." },
  { name: "Optimization", note: "Profiling with MicroProfiler, network budgets and memory." },
];

export const Skills = () => {
  const [active, setActive] = useState(0);
  return (
    <section id="skills" data-testid="skills-section" className="relative py-24 md:py-36">
      <div className="pointer-events-none absolute right-0 top-1/3 h-[420px] w-[420px] rounded-full bg-purple-600/15 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHead index="02" eyebrow="Toolkit" title={<>Skills &amp; <span className={`bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>Stack</span></>}>
          Hover or tap a skill to see how I use it in production.
        </SectionHead>
        <Reveal>
          <div data-testid="skills-card" className="glass rounded-3xl p-6 sm:p-10 md:p-14 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div className="flex flex-wrap gap-3">
              {skills.map((s, i) => (
                <motion.button
                  key={s.name}
                  data-testid={`skill-pill-${s.name.toLowerCase().replace(/[^a-z]/g, "")}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className={`rounded-full border px-5 py-3 min-h-[48px] font-display uppercase text-xl sm:text-2xl font-bold tracking-wide transition-[background-color,border-color,box-shadow,color] duration-300 ${
                    active === i
                      ? `${theme.border} bg-[var(--primary)]/15 text-white${theme.glow}`
                      : "border-white/12 bg-white/[0.03] text-slate-300 hover:border-purple-400/50"}`}
                >
                  {s.name}
                </motion.button>
              ))}
            </div>
            <div className="border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-10">
              <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400">{String(active + 1).padStart(2, "0")} / 06</p>
              <div className="min-h-[140px] flex flex-col justify-center">
                <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                  <p data-testid="skill-active-name" className={`mt-3 font-display uppercase font-extrabold text-5xl md:text-6xl bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>{skills[active].name}</p>
                  <p data-testid="skill-active-note" className="mt-4 text-slate-300 leading-relaxed">{skills[active].note}</p>
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};