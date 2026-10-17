import { gradients, currentTheme } from "@/data/gradients";

const theme = gradients[currentTheme];

export const Logo = ({ className = "h-8 w-8" }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={theme.primary} />
        <stop offset="100%" stopColor={theme.secondary} />
      </linearGradient>
    </defs>
    <path d="M32 8 52 20v24L32 56 12 44V20z" fill="none" stroke="url(#logo-g)" strokeWidth="4" strokeLinejoin="round" />
    <path d="M39 27h-12a5 5 0 0 0 0 10h6v-4" fill="none" stroke="url(#logo-g)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="43" cy="38" r="3" fill={theme.primary} />
  </svg>
);