"use client";

import { useEffect, useRef, type RefObject } from "react";

// Vimeo's own "background mode" (background=1) strips the title card, byline and play/pause
// overlay for us — none of the shield/curtain workarounds the YouTube embed needed. Player
// control (the mute button) goes through the official player.js SDK, loaded below.
// https://vimeo.com/1245398387
const VIMEO_ID = "1245398387";
const SRC = `https://player.vimeo.com/video/${VIMEO_ID}?background=1&autoplay=1&loop=1&muted=1&autopause=0&app_id=58479`;

export type VimeoPlayer = { setMuted: (muted: boolean) => Promise<void> };
type VimeoGlobal = { Player: new (el: HTMLIFrameElement) => VimeoPlayer };

export default function HeroVideo({ playerRef }: { playerRef: RefObject<VimeoPlayer | null> }) {
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let cancelled = false;

    const init = () => {
      if (cancelled || !frame.current) return;
      const Vimeo = (window as unknown as { Vimeo?: VimeoGlobal }).Vimeo;
      if (Vimeo) playerRef.current = new Vimeo.Player(frame.current);
    };

    const existing = (window as unknown as { Vimeo?: VimeoGlobal }).Vimeo;
    if (existing) {
      init();
    } else {
      const script = document.createElement("script");
      script.src = "https://player.vimeo.com/api/player.js";
      script.onload = init;
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, [playerRef]);

  return (
    <div className="hero__media">
      <iframe
        ref={frame}
        src={SRC}
        title="Blanket Hotels & Resorts — hero film"
        aria-hidden="true"
        tabIndex={-1}
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
