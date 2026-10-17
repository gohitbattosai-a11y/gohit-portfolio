import { gradients, currentTheme } from "@/data/gradients";

const theme = gradients[currentTheme];

const items = [
  "High-performance Luau",
  "Custom Inventory Frameworks",
  "Server-Authoritative Combat",
  "Client–Server Optimization",
  "Procedural Generation",
];

const Row = ({ hidden }) => (
  <div className="flex shrink-0 items-center" aria-hidden={hidden}>
    {items.map((t) => (
      <span key={t} className="flex items-center font-display uppercase font-extrabold text-4xl md:text-6xl tracking-tight px-6 md:px-10 whitespace-nowrap">
        <span className="text-slate-200">{t}</span>
        <span className={`ml-12 md:ml-20 h-3 w-3 rotate-45 bg-gradient-to-br ${theme.textGradient}`} />
      </span>
    ))}
  </div>
);

export const Marquee = () => (
  <div data-testid="editorial-marquee" className="marquee-wrap relative overflow-hidden border-y border-white/10 py-7 md:py-9 bg-white/[0.015]">
    <div className="marquee-track flex w-max">
      <Row />
      <Row hidden />
    </div>
    <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#080C14] to-transparent" />
    <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#080C14] to-transparent" />
  </div>
);