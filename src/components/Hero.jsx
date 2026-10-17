import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, Sparkles } from "lucide-react";
import { HeroCard } from "./HeroCard";
import { NetworkField } from "./NetworkField";
import { scrollToId } from "@/lib/scroll";
import { gradients, currentTheme } from "@/data/gradients";

const ease = [0.16, 1, 0.3, 1];
const theme = gradients[currentTheme];
const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&<>/";
const noise = (n) => Array.from({ length: n }, () => glyphs[(Math.random() * glyphs.length) | 0]).join("");

const Scramble = ({ text, delay = 0, duration = 1100 }) => {
  const [out, setOut] = useState(() => noise(text.length));
  const raf = useRef(0);
  const timer = useRef(0);

  const run = useCallback((wait, ms) => {
    cancelAnimationFrame(raf.current);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const t0 = performance.now();
      let last = 0;
      const tick = (now) => {
        const k = (now - t0) / ms;
        if (k >= 1) {
          setOut(text);
          return;
        }
        if (now - last > 40) {
          last = now;
          setOut(text.split("").map((c, i) => (k > (i + 1) / text.length ? c : glyphs[(Math.random() * glyphs.length) | 0])).join(""));
        }
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    }, wait);
  }, [text]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return undefined;
    }
    run(delay, duration);
    return () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <span className="relative inline-block cursor-default" onMouseEnter={() => run(0, 700)}>
      <span className="invisible">{text}</span>
      <span aria-hidden="true" className={`absolute inset-0 whitespace-nowrap bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>{out}</span>
    </span>
  );
};

const Line = ({ children, delay, className = "" }) => (
  <span className="block overflow-hidden pb-[0.06em]">
    <motion.span className={`block ${className}`} initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay, ease }}>
      {children}
    </motion.span>
  </span>
);

const GlassBtn = ({ testid, onClick, children, primary }) => (
  <button data-testid={testid} onClick={onClick}
    className={`glow-hover group inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 min-h-[52px] text-base font-semibold backdrop-blur-xl border w-full sm:w-auto transition-all duration-300 ${
      primary ? `bg-[var(--primary)]/15 ${theme.border} text-white hover:bg-[var(--primary)] hover:text-[#080C14] hover:border-[var(--primary)] ${theme.glow}` : "bg-white/[0.04] border-white/15 text-slate-200 hover:bg-white/10"}`}>
    {children}
    <ArrowDownRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
  </button>
);

export const Hero = () => {
  const { scrollY } = useScroll();
  const orbY = useTransform(scrollY, [0, 800], [0, 220]);
  const titleY = useTransform(scrollY, [0, 800], [0, -90]);
  const pointer = useRef({ x: 0, y: 0, active: false });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    pointer.current.x = x;
    pointer.current.y = y;
    pointer.current.active = true;
    e.currentTarget.style.setProperty("--mx", `${x}px`);
    e.currentTarget.style.setProperty("--my", `${y}px`);
  };
  const onLeave = () => { pointer.current.active = false; };

  return (
    <section id="top" data-testid="hero-section" onPointerMove={onMove} onPointerLeave={onLeave} onPointerCancel={onLeave}
      className="relative min-h-[100svh] overflow-hidden pt-28 md:pt-36 pb-16">
      <div className="absolute inset-0 grid-lines" />
      <motion.div style={{ y: orbY }} className={`pointer-events-none absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-gradient-to-br ${theme.bgOrb1} blur-[120px]`} />
      <motion.div style={{ y: orbY }} className={`pointer-events-none absolute top-40 -right-40 h-[560px] w-[560px] rounded-full bg-gradient-to-br ${theme.bgOrb2} blur-[130px]`} />
      <div className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(520px circle at var(--mx, 30%) var(--my, 35%), ${theme.primary}26, transparent 65%)` }} />
      <NetworkField pointer={pointer} />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 grid gap-14 lg:grid-cols-[1.25fr_1fr] lg:items-center">
        <motion.div style={{ y: titleY }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            data-testid="hero-status-badge"
            className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] ${theme.badge}`}>
            <span className={`pulse-dot h-2 w-2 rounded-full ${theme.dot}`} />
            Open for commissions
          </motion.div>

          <h1 aria-label="Gohit" className="font-display font-black uppercase leading-[0.82] tracking-tight mt-8">
            <Line delay={0.25} className="text-[30vw] sm:text-[11rem] lg:text-[13rem]"><Scramble text="Gohit" delay={250} /></Line>
          </h1>
          <h2 className="font-display uppercase font-bold leading-[0.95] text-3xl sm:text-5xl lg:text-[3.4rem] mt-2 text-slate-100">
            <Line delay={0.45}>Roblox Systems</Line>
            <Line delay={0.58} className="text-slate-400 italic">&amp; Custom Mechanics</Line>
          </h2>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1 }}
            className="mt-7 max-w-lg text-base md:text-lg text-slate-400 leading-relaxed">
            Luau scripter building server-authoritative combat, persistent data and buttery UI systems. Engineered to scale from 1 player to full servers.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.9, ease }}
            className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <GlassBtn testid="hero-showcase-button" primary onClick={() => scrollToId("showcase")}>
              <Sparkles size={18} /> My Showcase
            </GlassBtn>
            <GlassBtn testid="hero-commission-button" onClick={() => scrollToId("contact")}>Commission Me</GlassBtn>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 60, rotateX: 20 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.7, duration: 1.3, ease }} className="min-w-0">
          <HeroCard />
        </motion.div>
      </div>
    </section>
  );
};
