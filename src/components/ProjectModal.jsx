import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Play, X } from "lucide-react";
import { lockScroll, scrollToId } from "@/lib/scroll";
import { splitTitle, thumbOf } from "@/lib/project";
import { gradients, currentTheme } from "@/data/gradients";

const theme = gradients[currentTheme];

const navBtn = "grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 transition-colors hover:bg-[var(--primary)] hover:text-[#080C14]";

const Media = ({ p }) => {
  const img = thumbOf(p);
  return p.videoUrl ? (
    <iframe data-testid="project-modal-video" src={p.videoUrl} title={p.title} className="h-full w-full"
      allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
  ) : (
    <div data-testid="project-modal-video" className="relative h-full w-full">
      {img ? (
        <img src={img} alt={p.title} className="h-full w-full object-cover" />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgOrb1} via-slate-900 ${theme.bgOrb2}`} />
      )}
      <div className="absolute inset-0 grid place-items-center bg-[#080C14]/45">
        <div className="flex flex-col items-center gap-3">
          <span className={`grid h-16 w-16 place-items-center rounded-full border ${theme.border} bg-white/10 backdrop-blur ${theme.glow}`}>
            <Play size={24} className="ml-1 text-white" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-slate-200">Video preview coming soon</span>
        </div>
      </div>
    </div>
  );
};

export const ProjectModal = ({ project, position, total, onClose, onPrev, onNext }) => {
  const scroller = useRef(null);
  const open = !!project;

  useEffect(() => {
    lockScroll(open);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onPrev, onNext]);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTo({ top: 0 });
  }, [project?.id]);

  const hasFeatures = project?.features && project.features.length > 0;
  const { name, date } = project ? splitTitle(project.title) : { name: "", date: "" };

  return (
    <AnimatePresence>
      {project && (
        <motion.div key="project-modal" className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div data-testid="project-modal-backdrop" onClick={onClose} className="absolute inset-0 bg-[#04070d]/85 backdrop-blur-md" />
          <motion.div
            ref={scroller}
            data-testid="project-modal"
            role="dialog" aria-modal="true" aria-label={name}
            data-lenis-prevent
            initial={{ y: 60, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`glass relative max-h-[92svh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-t-3xl md:rounded-3xl ${theme.border} bg-[#0b1220]/95 shadow-2xl`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/10 bg-[#0b1220]/90 px-3 py-2.5 backdrop-blur md:px-4">
              <span className="pl-1 font-mono text-[11px] text-slate-400">{String(position).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
              <div className="flex items-center gap-2">
                {total > 1 && (
                  <>
                    <button data-testid="project-modal-prev" onClick={onPrev} aria-label="Previous project" className={navBtn}><ArrowLeft size={18} /></button>
                    <button data-testid="project-modal-next" onClick={onNext} aria-label="Next project" className={navBtn}><ArrowRight size={18} /></button>
                  </>
                )}
                <button data-testid="project-modal-close" onClick={onClose} aria-label="Close" className={navBtn}><X size={18} /></button>
              </div>
            </div>

            <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="aspect-video w-full overflow-hidden bg-black"><Media p={project} /></div>
              <div className="p-5 md:p-10">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span key={t} className={`rounded-full border ${theme.border} bg-white/5 px-3 py-1 font-mono text-[11px] text-white`}>{t}</span>
                  ))}
                </div>
                <h3 data-testid="project-modal-title" className="mt-5 font-display text-3xl font-extrabold uppercase leading-[0.95] text-white md:text-5xl lg:text-6xl">{name}</h3>
                {date && <p className="mt-2 font-mono text-xs text-slate-500">{date}</p>}
                <p className="mt-4 text-base leading-relaxed text-slate-300 md:text-lg">{project.shortDescription}</p>

                <div className={`mt-8 grid gap-8 ${hasFeatures ? "md:grid-cols-2" : "grid-cols-1"}`}>
                  <div>
                    <p className={`eyebrow mb-3 bg-gradient-to-r ${theme.textGradient} bg-clip-text font-mono text-xs uppercase tracking-wider text-transparent`}>Specs & architecture</p>
                    <p className="text-sm leading-relaxed text-slate-300 md:text-base">{project.fullSpecs}</p>
                  </div>
                  {hasFeatures && (
                    <div>
                      <p className={`eyebrow mb-3 bg-gradient-to-r ${theme.textGradient} bg-clip-text font-mono text-xs uppercase tracking-wider text-transparent`}>Feature list</p>
                      <ul className="space-y-3">
                        {project.features.map((f) => (
                          <li key={f} className="flex gap-3 text-sm text-slate-200 md:text-base">
                            <Check size={18} className="mt-0.5 shrink-0 text-[var(--primary)]" />{f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button data-testid="project-modal-commission-button" onClick={() => { onClose(); setTimeout(() => scrollToId("contact"), 350); }}
                  className={`glow-hover mt-10 min-h-[52px] w-full rounded-2xl border sm:w-auto ${theme.border} bg-white/10 px-7 py-4 font-semibold text-white transition-all hover:bg-[var(--primary)] hover:text-[#080C14]`}>
                  Want something like this? Commission me
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
