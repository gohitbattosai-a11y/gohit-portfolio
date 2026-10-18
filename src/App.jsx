import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { initLenis, lockScroll } from "@/lib/scroll";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Showcase } from "@/components/Showcase";
import { Skills } from "@/components/Skills";
import { Contact, Footer } from "@/components/Contact";
import { Intro } from "@/components/Intro";
import { gradients, currentTheme } from "@/data/gradients";

const SEEN = "gohit-intro";

const shouldPlayIntro = () => {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(SEEN) !== "1";
  } catch {
    return true;
  }
};

const ScrollProgress = ({ from, to }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, originX: 0, background: `linear-gradient(90deg, ${from}, ${to})` }}
      className="fixed inset-x-0 top-0 z-[65] h-[3px]"
    />
  );
};

const CustomScrollBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });

  return (
    <div className="fixed right-1.5 top-3 bottom-3 z-[60] pointer-events-none flex items-center">
      <div className="w-[3px] h-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          style={{ scaleY, originY: 0 }}
          className="w-full h-full bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] shadow-[0_0_10px_var(--primary)] rounded-full"
        />
      </div>
    </div>
  );
};

function App() {
  const [phase, setPhase] = useState(() => (shouldPlayIntro() ? "intro" : "done"));

  useEffect(() => {
    const destroy = initLenis();
    return () => destroy();
  }, []);

  useEffect(() => {
    lockScroll(phase === "intro");
  }, [phase]);

  const reveal = () => {
    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {}
    setPhase("reveal");
  };

  const live = phase !== "intro";
  const t = gradients[currentTheme];
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--primary', t.primary);
    document.documentElement.style.setProperty('--secondary', t.secondary);
  }

  return (
    <div className="relative min-h-screen bg-[#080C14] text-slate-50">
      <div className="grain" />
      <ScrollProgress from={t.secondary} to={t.primary} />
      <CustomScrollBar />
      {live && <Nav />}
      <main>
        {live && <Hero />}
        <Marquee />
        <Showcase />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <Toaster theme="dark" position="bottom-center" richColors />
      {phase !== "done" && <Intro onReveal={reveal} onDone={() => setPhase("done")} />}
      <Analytics />
    </div>
  );
}

export default App;
