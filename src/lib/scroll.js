import Lenis from "lenis";

let lenis = null;

export const initLenis = () => {
  lenis = new Lenis({ duration: 1.25, easing: (t) => 1 - Math.pow(1 - t, 4) });
  let raf;
  const loop = (time) => {
    lenis.raf(time);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    lenis.destroy();
    lenis = null;
  };
};

export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ behavior: "smooth" });
};

export const lockScroll = (locked) => {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
};

export const DISCORD_HANDLE = "@dev__vz";
export const DISCORD_URL = "https://discord.com/app";