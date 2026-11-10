"use client";

import { useEffect, useState, type RefObject } from "react";

export default function HeroMuteButton({ video }: { video: RefObject<HTMLVideoElement | null> }) {
  const [muted, setMuted] = useState(true);
  const [inHero, setInHero] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setInHero(entry.isIntersecting), { threshold: 0.1 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  if (!inHero) return null;

  return (
    <button
      type="button"
      className="hero__mute"
      onClick={toggle}
      aria-pressed={!muted}
      aria-label={muted ? "Unmute background video" : "Mute background video"}
    >
      {muted ? (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" />
          <path d="M17 9l4 6M21 9l-4 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" />
          <path
            d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
