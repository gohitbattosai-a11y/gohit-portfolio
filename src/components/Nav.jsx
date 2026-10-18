import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { scrollToId } from "@/lib/scroll";
import { gradients, currentTheme } from "@/data/gradients";

const theme = gradients[currentTheme];

const links = [
  ["showcase", "Showcase"],
  ["skills", "Skills"],
];

export const Nav = () => {
  const [open, setOpen] = useState(false);
  const go = (id) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-3 inset-x-3 md:top-5 md:inset-x-0 z-50"
    >
      <nav className="glass mx-auto max-w-6xl rounded-2xl px-3 py-2 md:px-4 flex items-center justify-between gap-4">
        <button
          data-testid="nav-logo"
          onClick={() => go("top")}
          className="flex items-center gap-2.5 min-h-[44px] px-1"
        >
          <Logo className="h-8 w-8" />
          <div className="flex flex-col items-start leading-none">
            <span className="font-display text-xl font-extrabold uppercase tracking-wide">
              IlTuoNome
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Created by IlTuoNome
            </span>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {links.map(([id, label]) => (
            <button
              key={id}
              data-testid={`nav-${id}-link`}
              onClick={() => go(id)}
              className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            data-testid="nav-discord-contact-button"
            onClick={() => go("contact")}
            className={`glow-hover rounded-xl border ${theme.border} bg-[var(--primary)]/10 px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-white hover:bg-[var(--primary)] hover:text-[#080C14] hover:border-[var(--primary)] transition-all duration-300 min-h-[44px]`}
          >
            <span className="sm:hidden">Contact</span>
            <span className="hidden sm:inline">Discord / Contact</span>
          </button>
          <button
            data-testid="nav-mobile-menu-toggle"
            aria-label="Menu"
            onClick={() => setOpen(!open)}
            className="md:hidden h-11 w-11 grid place-items-center rounded-xl border border-white/10"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          data-testid="nav-mobile-menu"
          className="glass md:hidden mt-2 rounded-2xl p-2 flex flex-col"
        >
          {links.map(([id, label]) => (
            <button
              key={id}
              data-testid={`nav-mobile-${id}-link`}
              onClick={() => go(id)}
              className="text-left px-4 py-3.5 rounded-xl font-display text-2xl uppercase font-bold hover:bg-white/5"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </motion.header>
  );
};
