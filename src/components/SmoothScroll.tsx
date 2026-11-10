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

    // Lenis measures the page's scrollable height once on init, but most of this site's actual
    // height only settles once images, the hero video iframe and web fonts finish loading —
    // without resyncing, its smooth-scroll math quietly drifts out of step with the real page,
    // which feels like the smoothing "missing" at random points rather than everywhere at once.
    const resync = () => lenis.resize();
    document.fonts?.ready.then(resync);
    window.addEventListener("load", resync);
    const resizeObserver = new ResizeObserver(resync);
    resizeObserver.observe(document.body);

    // Let menus pause page scrolling while they are open.
    const stop = () => lenis.stop();
    const start = () => lenis.start();
    window.addEventListener("blanket:lock", stop);
    window.addEventListener("blanket:unlock", start);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", resync);
      resizeObserver.disconnect();
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
