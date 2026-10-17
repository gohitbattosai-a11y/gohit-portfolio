import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Play, X } from "lucide-react";
import { lockScroll, scrollToId } from "@/lib/scroll";
import { gradients, currentTheme } from "@/data/gradients";

const theme = gradients[currentTheme];

const Media = ({ p }) =>
  p.videoUrl ? (
    <iframe data-testid="project-modal-video" src={p.videoUrl} title={p.title} className="h-full w-full"
      allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
  ) : (
    <div data-testid="project-modal-video" className="relative h-full w-full">
      {p.thumbnail ? (
        <img src={p.thumbnail} alt={p.title} className="h-full w-full object-cover" />
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

export const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    lockScroll(!!project);
    if (!project) return undefined;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  const hasFeatures = project?.features && project.features.length > 0;

  return (
    <AnimatePresence>
      {project && (
        <motion.div key={project.id} className="fixed inset-0 z-[70] flex items-end md:items-center justify-center p-3 md:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div data-testid="project-modal-backdrop" onClick={onClose} className="absolute inset-0 bg-[#04070d]/85 backdrop-blur-md" />
          <motion.div
            data-testid="project-modal"
            role="dialog" aria-modal="true" aria-label={project.title}
            data-lenis-prevent
            initial={{ y: 60, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`glass relative w-full max-w-5xl max-h-[92svh] overflow-y-auto rounded-t-3xl md:rounded-3xl ${theme.border} bg-[#0b1220]/95 shadow-2xl`}
          >
            <button data-testid="project-modal-close" onClick={onClose} aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/65 backdrop-blur hover:bg-[var(--primary)] hover:text-[#080C14] transition-colors">
              <X size={18} />
            </button>
            <div className="aspect-video w-full overflow-hidden bg-black"><Media p={project} /></div>
            <div className="p-6 md:p-10">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span key={t} className={`rounded-full border ${theme.border} bg-white/5 px-3 py-1 font-mono text-[11px] text-white`}>{t}</span>
                ))}
              </div>
              <h3 data-testid="project-modal-title" className="mt-5 font-display uppercase font-extrabold text-3xl md:text-5xl lg:text-6xl leading-[0.95] text-white">{project.title}</h3>
              <p className="mt-4 text-slate-300 text-base md:text-lg leading-relaxed">{project.shortDescription}</p>
              
              <div className={`mt-8 grid gap-8 ${hasFeatures ? "md:grid-cols-2" : "grid-cols-1"}`}>
                <div>
                  <p className={`eyebrow mb-3 bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent font-mono text-xs uppercase tracking-wider`}>Specs & architecture</p>
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed">{project.fullSpecs}</p>
                </div>
                {hasFeatures && (
                  <div>
                    <p className={`eyebrow mb-3 bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent font-mono text-xs uppercase tracking-wider`}>Feature list</p>
                    <ul className="space-y-3">
                      {project.features.map((f) => (
                        <li key={f} className="flex gap-3 text-sm md:text-base text-slate-200">
                          <Check size={18} className="mt-0.5 shrink-0 text-[var(--primary)]" />{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button data-testid="project-modal-commission-button" onClick={() => { onClose(); setTimeout(() => scrollToId("contact"), 350); }}
                className={`glow-hover mt-10 w-full sm:w-auto rounded-2xl border ${theme.border} bg-white/10 hover:bg-[var(--primary)] hover:text-[#080C14] px-7 py-4 min-h-[52px] font-semibold text-white transition-all`}>
                Want something like this? Commission me
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};