"use client";

import { useEffect, useRef } from "react";

/*
  A light, realistic drizzle over the whole site.

  - Drops sit at different depths: far drops are tiny, dim and slow; near drops are longer,
    a touch brighter and faster, with a soft motion-blur tail.
  - They slant with the same gentle, gusting breeze that carries the mist.
  - The drizzle slowly thickens and eases off over time, like passing showers.
  - Kept very faint on purpose; it never blocks clicks and stays off for visitors who reduce motion.
*/

type Drop = { x: number; y: number; z: number; len: number; speed: number; alpha: number; seed: number };

// Same breeze rhythm as the mist (MistLayer), so rain and mist move together.
const breezeAt = (t: number) => 0.022 * (1 + 0.45 * Math.sin(t * 0.11) + 0.25 * Math.sin(t * 0.37 + 1.3));

export default function Drizzle() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const small = window.matchMedia("(max-width: 900px)").matches;
    const MAX_DROPS = small ? 70 : 160;
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (d: Partial<Drop> = {}, anywhere = false): Drop => {
      const z = Math.pow(Math.random(), 1.6); // most drops are far away, a few are close
      return {
        x: Math.random() * (w + 200) - 100,
        y: anywhere ? Math.random() * h : -40 - Math.random() * h * 0.3,
        z,
        len: 6 + z * 22,
        speed: 420 + z * 900, // px per second
        alpha: 0.05 + z * 0.16,
        seed: Math.random(),
        ...d,
      };
    };
    const drops: Drop[] = Array.from({ length: MAX_DROPS }, () => spawn({}, true));

    let lastScroll = window.scrollY;
    let raf = 0;
    let last = performance.now();
    const start = last;
    const minFrame = small ? 1000 / 30 : 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < minFrame) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - start) / 1000;

      // Showers come and go: intensity drifts between light and very light.
      const intensity = 0.45 + 0.3 * Math.sin(t * 0.045) + 0.15 * Math.sin(t * 0.13 + 2);
      const active = Math.round(MAX_DROPS * Math.max(0.15, Math.min(1, intensity)));

      // Wind slant: horizontal speed relative to fall speed.
      const slant = 0.1 + breezeAt(t) * 4;

      // Scrolling nudges the near drops a little, so the rain feels like it is in front of the page.
      const scroll = window.scrollY;
      const scrollDelta = scroll - lastScroll;
      lastScroll = scroll;

      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";

      for (let i = 0; i < active; i++) {
        const d = drops[i];
        const fall = d.speed * dt;
        d.y += fall - scrollDelta * d.z * 0.25;
        d.x += fall * slant;
        if (d.y - d.len > h || d.x > w + 100) {
          drops[i] = spawn();
          continue;
        }

        // Tail direction follows the drop's actual motion.
        const tx = d.len * slant;
        const ty = d.len;
        // Faint tail, slightly brighter head: reads as a blurred falling drop, not a line.
        ctx.lineWidth = 0.5 + d.z * 0.9;
        ctx.strokeStyle = `rgba(222, 232, 236, ${(d.alpha * 0.45).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(d.x - tx, d.y - ty);
        ctx.lineTo(d.x - tx * 0.35, d.y - ty * 0.35);
        ctx.stroke();
        ctx.strokeStyle = `rgba(232, 240, 244, ${d.alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(d.x - tx * 0.35, d.y - ty * 0.35);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
      }
    };

    raf = requestAnimationFrame(frame);
    canvas.classList.add("is-on");

    // Hidden over the hero (its own video/shade reads better without rain over it); shown
    // everywhere else on the page.
    const hero = document.getElementById("top");
    let io: IntersectionObserver | undefined;
    if (hero) {
      io = new IntersectionObserver(
        ([entry]) => canvas.classList.toggle("is-hidden", entry.isIntersecting),
        { threshold: 0.15 },
      );
      io.observe(hero);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      io?.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="drizzle" aria-hidden="true" />;
}
