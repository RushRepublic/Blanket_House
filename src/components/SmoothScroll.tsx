"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

// Weighted, soft scrolling on desktop. Touch devices keep their native scrolling.
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ duration: 1.25, smoothWheel: true, anchors: { offset: 0 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Let menus pause page scrolling while they are open.
    const stop = () => lenis.stop();
    const start = () => lenis.start();
    window.addEventListener("blanket:lock", stop);
    window.addEventListener("blanket:unlock", start);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("blanket:lock", stop);
      window.removeEventListener("blanket:unlock", start);
      lenis.destroy();
    };
  }, []);

  return null;
}

export function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle("is-locked", locked);
  window.dispatchEvent(new Event(locked ? "blanket:lock" : "blanket:unlock"));
}
