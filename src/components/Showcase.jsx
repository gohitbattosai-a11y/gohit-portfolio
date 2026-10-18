import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Play } from "lucide-react";
import { projects } from "@/data/projects";
import { splitTitle, thumbOf } from "@/lib/project";
import { scrollToId } from "@/lib/scroll";
import { SectionHead } from "./Reveal";
import { ProjectModal } from "./ProjectModal";
import { gradients, currentTheme } from "@/data/gradients";

const theme = gradients[currentTheme];
const PAGE = 6;
const ease = [0.16, 1, 0.3, 1];

const sorted = [...projects].sort((a, b) => Number(b.layout === "feature") - Number(a.layout === "feature"));

const tagStats = (() => {
  const count = {};
  projects.forEach((p) => p.tags.forEach((t) => { count[t] = (count[t] || 0) + 1; }));
  return Object.entries(count)
    .filter(([, n]) => n > 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 7);
})();

const Card = ({ p, onOpen }) => {
  const { name, date } = splitTitle(p.title);
  const img = thumbOf(p);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, ease }}
      className="min-w-0"
    >
      <button
        data-testid={`showcase-card-${p.id}`}
        onClick={() => onOpen(p)}
        className="group flex h-full w-full gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] p-2.5 text-left transition-colors duration-300 hover:border-[var(--primary)]/60 hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)] sm:flex-col sm:gap-0 sm:p-3"
      >
        <div className={`relative aspect-[4/3] w-[38%] max-w-[170px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${theme.bgOrb1} via-[#0b1329] ${theme.bgOrb2} sm:aspect-video sm:w-full sm:max-w-none`}>
          {img && (
            <img
              src={img}
              alt=""
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}
          <span className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-[var(--primary)] group-hover:text-[#080C14]">
            <Play size={13} className="ml-0.5" />
          </span>
          {p.layout === "feature" && (
            <span className={`absolute left-2 top-2 rounded-full border ${theme.border} bg-black/60 px-2.5 py-1 font-mono text-[10px] text-white backdrop-blur-sm`}>Featured</span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center sm:px-1.5 sm:pb-1.5 sm:pt-4">
          <h3 className="font-display text-xl font-extrabold uppercase leading-[0.95] text-white sm:text-2xl">{name}</h3>
          {date && <p className="mt-1.5 font-mono text-[11px] text-slate-500">{date}</p>}
          <p className="mt-2.5 hidden text-sm leading-relaxed text-slate-400 sm:line-clamp-2">{p.shortDescription}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5 sm:mt-3.5">
            {p.tags.slice(0, 3).map((t, i) => (
              <span key={t} className={`rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[10.5px] text-slate-300 ${i === 2 ? "hidden sm:inline-block" : ""}`}>{t}</span>
            ))}
          </div>
        </div>
      </button>
    </motion.li>
  );
};

export const Showcase = () => {
  const [activeId, setActiveId] = useState(null);
  const [tag, setTag] = useState("All");
  const [shown, setShown] = useState(PAGE);

  const list = tag === "All" ? sorted : sorted.filter((p) => p.tags.includes(tag));
  const visible = list.slice(0, shown);
  const remaining = list.length - visible.length;
  const idx = list.findIndex((p) => p.id === activeId);
  const active = idx >= 0 ? list[idx] : null;

  const pick = (t) => {
    setTag(t);
    setShown(PAGE);
  };
  const close = () => setActiveId(null);
  const step = (d) => setActiveId(list[(idx + d + list.length) % list.length].id);
  const collapse = () => {
    setShown(PAGE);
    scrollToId("showcase");
  };

  const chips = [["All", projects.length], ...tagStats];

  return (
    <section id="showcase" data-testid="showcase-section" className="relative py-16 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHead index="01" eyebrow="Selected work" title={<>The <span className={`bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>Showcase</span></>}>
          Systems shipped for live Roblox experiences. Filter by topic and tap a project to open the full breakdown.
        </SectionHead>

        <div className="sticky top-[82px] z-30 mb-5 md:top-[94px] md:mb-7">
          <div className="glass flex items-center gap-2 rounded-2xl p-1.5">
            <div data-lenis-prevent className="no-scrollbar flex min-w-0 flex-1 snap-x gap-1.5 overflow-x-auto">
              {chips.map(([t, n]) => {
                const on = tag === t;
                return (
                  <button
                    key={t}
                    data-testid={`showcase-filter-${t.toLowerCase().replace(/[^a-z]/g, "")}`}
                    aria-pressed={on}
                    onClick={() => pick(t)}
                    className={`min-h-[40px] shrink-0 snap-start whitespace-nowrap rounded-xl border px-3.5 text-sm font-semibold transition-colors duration-300 ${
                      on ? `${theme.border} bg-[var(--primary)]/15 text-white` : "border-transparent text-slate-400 hover:text-white"
                    }`}
                  >
                    {t}<span className="ml-1.5 font-mono text-[11px] opacity-60">{n}</span>
                  </button>
                );
              })}
            </div>
            <span className="hidden shrink-0 px-3 font-mono text-[11px] text-slate-400 md:block">{visible.length} / {list.length}</span>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p) => <Card key={p.id} p={p} onOpen={(x) => setActiveId(x.id)} />)}
          </AnimatePresence>
        </ul>

        {list.length > PAGE && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${(visible.length / list.length) * 100}%`, background: `linear-gradient(90deg, ${theme.secondary}, ${theme.primary})` }} />
            </div>
            <p className="font-mono text-[11px] text-slate-400">Showing {visible.length} of {list.length}</p>
            <button
              data-testid="showcase-more-button"
              onClick={remaining > 0 ? () => setShown((s) => s + PAGE) : collapse}
              className={`inline-flex min-h-[48px] items-center gap-2 rounded-2xl border ${theme.border} bg-[var(--primary)]/10 px-6 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[var(--primary)] hover:text-[#080C14]`}
            >
              {remaining > 0 ? <>Show {Math.min(PAGE, remaining)} more <ChevronDown size={16} /></> : <>Show less <ChevronUp size={16} /></>}
            </button>
          </div>
        )}
      </div>

      <ProjectModal
        project={active}
        position={idx + 1}
        total={list.length}
        onClose={close}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
      />
    </section>
  );
};
