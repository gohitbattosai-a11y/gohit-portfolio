import { useEffect, useRef } from "react";
import { gradients, currentTheme } from "@/data/gradients";

const theme = gradients[currentTheme];

const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const LINK = 150;
const PULL = 200;
const CORE = 70;

export const NetworkField = ({ pointer }) => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const [pr, pg, pb] = rgb(theme.primary);
    const [sr, sg, sb] = rgb(theme.secondary);
    let w = 0;
    let h = 0;
    let nodes = [];
    let raf = 0;
    let visible = true;

    const seed = () => {
      const count = Math.min(Math.round((w * h) / 15000), w < 640 ? 36 : 85);
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.4 + 0.9,
        hot: Math.random() < 0.18,
        phase: Math.random(),
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const widthChanged = Math.abs(rect.width - w) > 1;
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (widthChanged || !nodes.length) seed();
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      const m = pointer.current;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if ((n.x < 0 && n.vx < 0) || (n.x > w && n.vx > 0)) n.vx *= -1;
        if ((n.y < 0 && n.vy < 0) || (n.y > h && n.vy > 0)) n.vy *= -1;
        if (m.active) {
          const dx = m.x - n.x;
          const dy = m.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < PULL * PULL && d2 > 1) {
            const d = Math.sqrt(d2);
            const k = d < CORE ? -(1 - d / CORE) * 1.3 : (1 - d / PULL) * 0.4;
            n.x += (dx / d) * k;
            n.y += (dy / d) * k;
          }
        }
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const alpha = (1 - Math.sqrt(d2) / LINK) * 0.32;
            ctx.strokeStyle = `rgba(${pr},${pg},${pb},${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        if (m.active) {
          const dx = a.x - m.x;
          const dy = a.y - m.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < PULL * PULL) {
            const alpha = (1 - Math.sqrt(d2) / PULL) * 0.7;
            ctx.strokeStyle = `rgba(${pr},${pg},${pb},${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }

        if (a.hot) {
          const k = (t * 0.00045 + a.phase) % 1;
          ctx.strokeStyle = `rgba(${pr},${pg},${pb},${(1 - k) * 0.55})`;
          ctx.beginPath();
          ctx.arc(a.x, a.y, a.r + k * 16, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = `rgba(${pr},${pg},${pb},0.95)`;
        } else {
          ctx.fillStyle = `rgba(${sr},${sg},${sb},0.85)`;
        }
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t) => {
      raf = 0;
      if (!visible || document.hidden) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!raf && !reduce) raf = requestAnimationFrame(loop);
    };

    resize();
    if (reduce) draw(0);
    else start();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0);
    });
    ro.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pointer]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{
        maskImage: "linear-gradient(to bottom, black 65%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, black 65%, transparent)",
      }}
    />
  );
};
