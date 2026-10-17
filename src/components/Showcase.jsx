import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { projects } from "@/data/projects";
import { SectionHead } from "./Reveal";
import { ProjectModal } from "./ProjectModal";
import { gradients, currentTheme } from "@/data/gradients";

const theme = gradients[currentTheme];

const spans = {
  feature: "md:col-span-2 md:row-span-2",
  wide: "md:col-span-2",
  "tall-md": "md:col-span-2 lg:col-span-1",
  default: "",
};

const Card = ({ p, i, onOpen }) => {
  const big = p.layout === "feature";
  return (
    <motion.button
      data-testid={`showcase-card-${p.id}`}
      onClick={() => onOpen(p)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`glass glow-hover group relative overflow-hidden rounded-3xl text-left min-h-[320px] border border-white/10 ${spans[p.layout] || ""}`}
    >
      {p.thumbnail ? (
        <img 
          src={p.thumbnail} 
          alt={p.title} 
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-[1.2s] ease-out group-hover:scale-110" 
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgOrb1} via-[#0b1329] ${theme.bgOrb2} transition-transform duration-[1.2s] ease-out group-hover:scale-110`} />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-[#080C14]/60 to-transparent" />

      <div className="absolute top-5 left-5 right-5 flex items-start justify-between z-10">
        <span className="font-mono text-[11px] text-slate-300 font-semibold">{String(i + 1).padStart(2, "0")} — {p.tags[0]}</span>
        <span className={`grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/40 backdrop-blur transition-all duration-300 group-hover:bg-[var(--primary)] group-hover:text-[#080C14] group-hover:border-[var(--primary)] group-hover:rotate-45`}>
          <ArrowUpRight size={18} />
        </span>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-6 md:p-7 z-10">
        {big && (
          <span className={`mb-4 hidden md:inline-flex items-center gap-2 rounded-full border ${theme.border} bg-white/5 px-3 py-1.5 font-mono text-[11px] uppercase text-white backdrop-blur`}>
            <Play size={12} /> Featured system
          </span>
        )}
        <h3 className={`font-display uppercase font-extrabold leading-[0.95] text-white drop-shadow-md ${big ? "text-4xl md:text-6xl" : "text-3xl"}`}>{p.title}</h3>
        <p className={`mt-3 text-slate-200 leading-relaxed font-medium drop-shadow-sm ${big ? "max-w-md text-base" : "text-sm"}`}>{p.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span key={t} className="rounded-full border border-white/20 bg-black/40 px-2.5 py-1 font-mono text-[11px] text-slate-100">{t}</span>
          ))}
        </div>
      </div>
    </motion.button>
  );
};

export const Showcase = () => {
  const [active, setActive] = useState(null);
  return (
    <section id="showcase" data-testid="showcase-section" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHead index="01" eyebrow="Selected work" title={<>The <span className={`bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>Showcase</span></>}>
          Systems shipped for live Roblox experiences. Tap any card to open the full architecture breakdown.
        </SectionHead>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[320px] md:auto-rows-[300px] gap-5 md:gap-6">
          {projects.map((p, i) => <Card key={p.id} p={p} i={i} onOpen={setActive} />)}
        </div>
      </div>
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
};