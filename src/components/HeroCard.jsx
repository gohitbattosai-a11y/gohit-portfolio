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
  ["op", "      "], ["kw", "return "], ["kw", "false"],
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
      const n = Math.min(total, Math.floor(Math.max(0, now - t0 - 1100) * 0.35));
      setTyped(n);
      if (n < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 15 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    mx.set(x / r.width - 0.5);
    my.set(y / r.height - 0.5);
    mouseX.set(x);
    mouseY.set(y);
  };

  const reset = () => { 
    mx.set(0); 
    my.set(0); 
  };

  const lineCount = code.filter(([t]) => t === "br").length + 1;

  return (
    <div onMouseMove={onMove} onMouseLeave={reset} style={{ perspective: 1400 }} className="w-full max-w-2xl mx-auto cursor-default">
      <motion.div
        data-testid="hero-3d-card"
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className={`glass relative rounded-2xl p-4 sm:p-6 ${theme.glow} border border-white/15 bg-slate-950/95 backdrop-blur-xl shadow-2xl overflow-hidden`}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(255,255,255,0.08), transparent 80%)`
            ),
          }}
        />

        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3 relative z-10" style={{ transform: "translateZ(25px)" }}>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/90 shadow-sm shadow-red-500/50" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/90 shadow-sm shadow-yellow-500/50" />
              <span className="h-3 w-3 rounded-full bg-green-500/90 shadow-sm shadow-green-500/50" />
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <span className="min-w-0 truncate font-mono text-[11px] sm:text-xs text-slate-300 font-medium">ServerScriptService / NetworkManager.luau</span>
          </div>

          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${theme.badge} text-[10px] font-mono`}>
            <span className={`h-1.5 w-1.5 rounded-full ${theme.dot} animate-pulse`} />
            LIVE SECURE
          </div>
        </div>

        <div className="overflow-x-auto py-2 relative z-10 flex gap-4">
          <div className="select-none font-mono text-[10px] sm:text-[12px] leading-5 text-slate-600 text-right pr-2 border-r border-white/5 flex flex-col">
            {Array.from({ length: lineCount }).map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>

          <div className="grid flex-1" style={{ transform: "translateZ(40px)" }}>
            <pre aria-hidden="true" className="invisible font-mono text-[10px] sm:text-[12px] leading-5 whitespace-pre select-none text-left [grid-area:1/1]">{render(total)}</pre>
            <pre className="font-mono text-[10px] sm:text-[12px] leading-5 whitespace-pre select-none text-left [grid-area:1/1]">{render(typed)}<span className="inline-block w-2 h-4 bg-white/80 animate-pulse ml-0.5 align-middle" /></pre>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 relative z-10" style={{ transform: "translateZ(60px)" }}>
          {[
            ["Luau OOP", "Architecture"],
            ["Rate-Limited", "Anti-Exploit"],
            ["Strict Types", "Type-Checking"]
          ].map(([v, l], index) => (
            <motion.div 
              key={l}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center shadow-lg backdrop-blur-md"
            >
              <p className={`font-display text-sm sm:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.textGradient}`}>
                {v}
              </p>
              <p className="font-mono text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider mt-1">{l}</p>
            </motion.div>
          ))}
        </div>

        <div className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${theme.bgOrb1} via-transparent ${theme.bgOrb2} opacity-60 -z-10 blur-2xl`} />
      </motion.div>
    </div>
  );
};
