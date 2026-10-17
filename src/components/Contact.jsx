import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";
import { Logo } from "./Logo";
import { DISCORD_HANDLE, DISCORD_URL } from "@/lib/scroll";
import { gradients, currentTheme } from "@/data/gradients";

const theme = gradients[currentTheme];

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
    <path d="M20.3 4.4A19.6 19.6 0 0 0 15.4 3l-.6 1.3a18.2 18.2 0 0 0-5.6 0L8.6 3a19.5 19.5 0 0 0-4.9 1.4C.6 9 -.3 13.6.1 18.1a19.7 19.7 0 0 0 6 3l1.3-2.1a12.8 12.8 0 0 1-2-1l.5-.4a14 14 0 0 0 12.2 0l.5.4c-.6.4-1.3.7-2 1l1.3 2.1a19.6 19.6 0 0 0 6-3c.5-5.2-.9-9.8-3.6-13.7ZM8 15.4c-1.2 0-2.2-1.1-2.2-2.4S6.8 10.6 8 10.6s2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z" />
  </svg>
);

const copy = async () => {
  try {
    await navigator.clipboard.writeText(DISCORD_HANDLE);
    toast.success(`Copied ${DISCORD_HANDLE} — add me on Discord!`);
  } catch {
    toast(`Discord: ${DISCORD_HANDLE}`);
  }
};

export const Contact = () => (
  <section id="contact" data-testid="contact-section" className="relative py-28 md:py-40 overflow-hidden">
    <div className={`pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r ${theme.bgOrb1} ${theme.bgOrb2} blur-[120px]`} />
    <div className="relative mx-auto max-w-5xl px-5 sm:px-6 lg:px-8 text-center">
      <Reveal>
        <p className="eyebrow">03 / Contact</p>
        <h2 className="mt-6 font-display uppercase font-black leading-[0.85] text-6xl sm:text-8xl lg:text-[9rem]">
          Let's build <br /><span className={`bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>your system.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-slate-400">DMs open. Tell me about your game, the feature and your timeline.</p>
      </Reveal>
      <Reveal delay={0.15} className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
        <motion.a
          data-testid="contact-discord-button"
          href={DISCORD_URL} target="_blank" rel="noopener noreferrer" onClick={copy}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          className={`discord-glow inline-flex items-center justify-center gap-3 rounded-2xl border ${theme.border} bg-gradient-to-r ${theme.bgOrb1} ${theme.bgOrb2} px-8 py-5 min-h-[60px] text-lg font-semibold text-white backdrop-blur-xl`}
        >
          <DiscordIcon /> Message {DISCORD_HANDLE}
        </motion.a>
        <button data-testid="copy-discord-button" onClick={copy}
          className="glow-hover glass inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-5 min-h-[60px] text-slate-200">
          <Copy size={18} /> Copy username
        </button>
      </Reveal>
    </div>
  </section>
);

export const Footer = () => (
  <footer data-testid="site-footer" className="border-t border-white/10">
    <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
      <div className="flex items-center gap-2.5"><Logo className="h-6 w-6" /><span className="font-display uppercase font-bold text-slate-200 text-lg">Gohit</span></div>
      <p className="font-mono text-[12px]">© {new Date().getFullYear()} Gohit — Roblox Luau Scripter</p>
    </div>
  </footer>
);