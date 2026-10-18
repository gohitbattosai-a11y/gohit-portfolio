import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gradients, currentTheme } from "@/data/gradients";

const theme = gradients[currentTheme];

const code = [
  ["kw", "type "], ["id", "PlayerData "], ["op", "= { "], ["id", "Coins"], ["op", ": "], ["type", "number"], ["op", ", "], ["id", "Inventory"], ["op", ": { "], ["type", "string"], ["op", " } }"],
  ["br"], ["br"],
  ["kw", "local "], ["id", "NetworkManager "], ["op", "= {}"],
  ["br"],
  ["id", "NetworkManager"], ["op", "."], ["id", "__index "], ["op", "= "], ["id", "NetworkManager"],
  ["br"], ["br"],
  ["kw", "function "], ["id", "NetworkManager"], ["op", "."], ["fn", "new"], ["op", "(): "], ["id", "NetworkManager"],
  ["br"],
  ["op", "   "], ["kw", "local "], ["id", "self "], ["op", "= "], ["fn", "setmetatable"], ["op", "({}, "], ["id", "NetworkManager"], ["op", ")"],
  ["br"],
  ["op", "   "], ["id", "self"], ["op", "."], ["id", "_rateLimits "], ["op", "= {}"],
  ["br"],
  ["op", "   "], ["kw", "return "], ["id", "self"],
  ["br"],
  ["kw", "end"],
  ["br"], ["br"],
  ["kw", "function "], ["id", "NetworkManager"], ["op", ":"], ["fn", "ValidateRequest"], ["op", "("],
  ["br"],
  ["op", "   "], ["id", "player"], ["op", ": "], ["type", "Player"], ["op", ", "], ["id", "action"], ["op", ": "], ["type", "string"],
  ["br"],
  ["op", "): "], ["type", "boolean"],
  ["br"],
  ["op", "   "], ["kw", "local "], ["id", "now "], ["op", "= "], ["fn", "os.clock"], ["op", "()"],
  ["br"],
  ["op", "   "], ["kw", "local "], ["id", "lastCall "], ["op", "= "], ["id", "self"], ["op", "."], ["id", "_rateLimits"], ["op", "["], ["id", "player.UserId"], ["op", "] "], ["kw", "or "], ["op", "0"],
  ["br"],
  ["op", "   "], ["if "], ["id", "now "], ["op", "- "], ["id", "lastCall "], ["op", "< "], ["op", "0.1 "], ["kw", "then"],
  ["br"],
  ["op", "      "], ["kw", "return "], ["kw", "false"], ["op", " -- Anti-Spam Triggered"],
  ["br"],
  ["op", "   "], ["kw", "end"],
  ["br"],
  ["op", "   "], ["id", "self"], ["op", "."], ["id", "_rateLimits"], ["op", "["], ["id", "player.UserId"], ["op", "] = "], ["id", "now"],
  ["br"],
  ["op", "   "], ["kw", "return "], ["kw", "true"],
  ["br"],
  ["kw", "end"],
];

const colors = { 
  kw: "text-purple-400 font-bold", 
  id: "text-slate-100", 
  op: "text-slate-400", 
  fn: "text-amber-300 font-medium",
  type: "text-emerald-400"
};

const total = code.reduce((sum, [t, v]) => sum + (t === "br" ? 1 : v.length), 0);

const render = (limit) => {
  const out = [];
  let used = 0;
  for (let i = 0; i < code.length && used < limit; i++) {
    const [t, v] = code[i];
    if (t === "br") {
      out.push(<br key={i} />);
      used += 1;
      continue;
    }
    const take = Math.min(v.length, limit - used);
    out.push(<span key={i} className={colors[t]}>{v.slice(0, take)}</span>);
    used += take;
  }
  return out;
};

export const HeroCard = () => {
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(total);
      return undefined;
    }
    let raf = 0;
    let t0 = 0;
    const tick = (now) => {
      if (!t0) t0 = now;
      const n = Math.min(total, Math.floor(Math.max(0, now - t0 - 1100) * 0.26));
      setTyped(n);
      if (n < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 14 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const reset = () => { 
    mx.set(0); 
    my.set(0); 
  };

  return (
    <div onMouseMove={onMove} onMouseLeave={reset} style={{ perspective: 1200 }} className="w-full max-w-2xl mx-auto">
      <motion.div
        data-testid="hero-3d-card"
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className={`glass relative rounded-2xl p-4 sm:p-6 ${theme.glow} border border-white/10 bg-slate-950/90 backdrop-blur-md`}
      >
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3" style={{ transform: "translateZ(20px)" }}>
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="min-w-0 truncate pl-3 font-mono text-[10px] sm:text-xs text-slate-400">ServerScriptService / NetworkManager.luau</span>
        </div>

        <div className="overflow-x-auto py-2">
          <div className="grid" style={{ transform: "translateZ(35px)" }}>
            <pre aria-hidden="true" className="invisible font-mono text-[10px] sm:text-[12px] leading-5 whitespace-pre select-none text-left [grid-area:1/1]">{render(total)}</pre>
            <pre className="font-mono text-[10px] sm:text-[12px] leading-5 whitespace-pre select-none text-left [grid-area:1/1]">{render(typed)}<span className="caret" /></pre>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/5 pt-4" style={{ transform: "translateZ(50px)" }}>
          {[
            ["Luau OOP", "Architecture"],
            ["Rate-Limited", "Anti-Exploit"],
            ["Strict Types", "Type-Checking"]
          ].map(([v, l]) => (
            <div key={l} className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-center">
              <p className={`font-display text-sm sm:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.textGradient}`}>
                {v}
              </p>
              <p className="font-mono text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{l}</p>
            </div>
          ))}
        </div>

        <div className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${theme.bgOrb1} via-transparent ${theme.bgOrb2} opacity-50 -z-10 blur-xl`} />
      </motion.div>
    </div>
  );
};
