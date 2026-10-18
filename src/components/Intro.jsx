import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { Logo } from "./Logo";
import { projects } from "@/data/projects";
import { gradients, currentTheme } from "@/data/gradients";

const theme = gradients[currentTheme];
const split = { duration: 1.15, ease: [0.76, 0, 0.24, 1] };

const lines = [
  [0, "Server", "Booting GohitServer"],
  [16, "Net", "NetworkManager online, rate limits armed"],
  [36, "Data", "ProfileService session locked"],
  [56, "Gui", "Tween pipeline compiled"],
  [76, "Perf", "Heartbeat steady at 60 FPS"],
  [94, "Ready", `${projects.length} systems loaded. Welcome.`],
];

export const Intro = ({ onReveal, onDone }) => {
  const [p, setP] = useState(0);
  const [open, setOpen] = useState(false);
  const bar = useMotionValue(0);
  const opened = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    let hold = 0;

    const finish = () => {
      if (opened.current) return;
      opened.current = true;
      bar.set(1);
      setP(100);
      setOpen(true);
      onReveal();
    };

    const run = animate(0, 100, {
      duration: 2.6,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        bar.set(v / 100);
        setP(Math.round(v));
      },
      onComplete: () => {
        hold = setTimeout(finish, 380);
      },
    });

    const skip = () => {
      run.stop();
      clearTimeout(hold);
      finish();
    };

    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      run.stop();
      clearTimeout(hold);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  const digits = String(p);
  const pad = "0".repeat(3 - digits.length);

  return (
    <div role="status" aria-label="Loading" className={`fixed inset-0 z-[100] overflow-hidden ${open ? "pointer-events-none" : "cursor-pointer"}`}>
      <motion.div
        animate={{ y: open ? "-100%" : "0%" }}
        transition={split}
        onAnimationComplete={() => { if (open) onDone(); }}
        className="absolute inset-x-0 top-0 flex h-1/2 flex-col justify-between bg-[#080C14] px-[6vw] pb-6 pt-7"
      >
        <div className="flex items-center gap-3">
          <Logo className="h-9 w-9" />
          <span className="font-display text-2xl font-extrabold uppercase tracking-wide">Gohit</span>
          <span className="font-mono text-[11px] text-slate-500">.luau</span>
        </div>
        <ul className="h-[9.5rem] space-y-0.5 font-mono text-[12px] leading-6 sm:text-[13px]">
          {lines.filter(([at]) => p >= at).map(([at, tag, msg]) => {
            const last = at === 94;
            return (
              <motion.li key={tag} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="flex gap-3">
                <span className={last ? "text-[var(--primary)]" : "text-slate-500"}>[{tag}]</span>
                <span className={last ? "text-white" : "text-slate-300"}>{msg}</span>
              </motion.li>
            );
          })}
        </ul>
      </motion.div>

      <motion.div
        animate={{ y: open ? "100%" : "0%" }}
        transition={split}
        className="absolute inset-x-0 bottom-0 flex h-1/2 items-start justify-between bg-[#080C14] px-[6vw] pt-3"
      >
        <span className="font-display font-black leading-[0.8] tabular-nums" style={{ fontSize: "min(46vw, 38vh)" }}>
          <span className="text-white/10">{pad}</span>
          <span className={`bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>{digits}</span>
        </span>
        <span className="pt-1 font-mono text-[11px] text-slate-500"><span className="sm:hidden">Tap to skip</span><span className="hidden sm:inline">Press any key to skip</span></span>
      </motion.div>

      <motion.div
        animate={open ? { opacity: 0, scaleY: 10 } : { opacity: 1, scaleY: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="pointer-events-none absolute inset-x-0 top-1/2 -mt-px h-[2px]"
      >
        <motion.div
          className="h-full"
          style={{
            scaleX: bar,
            originX: 0,
            background: "linear-gradient(90deg, var(--secondary), var(--primary))",
            boxShadow: "0 0 22px 3px var(--primary)",
          }}
        />
      </motion.div>
    </div>
  );
};
