import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gradients, currentTheme } from "@/data/gradients";

const theme = gradients[currentTheme] || gradients.sunset;

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

const safeCode = Array.isArray(code) ? code : [];
const total = safeCode.reduce((sum, [t, v]) => sum + (t === "br" ? 1 : (v ? v.length : 0)), 0);

const render = (limit) => {
  const out = [];
  let used = 0;
  for (let i = 0; i < safeCode.length && used < limit; i++) {
    const [t, v] = safeCode[i];
    if (t === "br") {
      out.push(<br key={i} />);
      used += 1;
      continue;
    }
    const take = Math.min((v || "").length, limit - used);
    out.push(<span key={i} className={colors[t] || ""}>{(v || "").slice(0, take)}</span>);
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
      const n = Math.min(total, Math.floor(Math.max(0, now - t0 - 800) * 0.3));
      setTyped(n);
      if (n < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 100, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 100, damping: 20 });

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
    <div onMouseMove={onMove} onMouseLeave={reset} style={{ perspective: 1000 }} className="w-full max-w-2xl mx-auto">
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className={`relative rounded-3xl p-6 ${theme.glow} border border-white/10 bg-slate-950/90 backdrop-blur-2xl shadow-2xl`}
      >
        {/* Intestazione minimale */}
        <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-4" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="font-mono text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            NetworkManager.luau
          </span>
        </div>

        {/* Blocco Codice Pulito */}
        <div className="overflow-x-auto py-1" style={{ transform: "translateZ(30px)" }}>
          <pre className="font-mono text-xs sm:text-sm leading-relaxed whitespace-pre select-none text-left">
            {render(typed)}
            <span className="inline-block w-2 h-4 bg-white animate-pulse ml-0.5 align-middle" />
          </pre>
        </div>

        {/* Sfumatura di sfondo stilizzata */}
        <div className={`pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-tr ${theme.bgOrb1} via-transparent ${theme.bgOrb2} opacity-40 -z-10 blur-xl`} />
      </motion.div>
    </div>
  );
};
