import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, className = "", y = 40 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export const SectionHead = ({ index, eyebrow, title, children }) => (
  <Reveal className="mb-12 md:mb-16 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
    <div>
      <p className="eyebrow mb-4">
        <span className="text-slate-400">{index} /</span> {eyebrow}
      </p>
      <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold uppercase leading-[0.9] tracking-tight">
        {title}
      </h2>
    </div>
    {children && <p className="max-w-sm text-sm md:text-base text-slate-400 leading-relaxed">{children}</p>}
  </Reveal>
);