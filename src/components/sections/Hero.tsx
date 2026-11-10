"use client";

import { useRef } from "react";
import BookingBar from "../BookingBar";
import HeroVideo from "../HeroVideo";
import HeroMuteButton from "../HeroMuteButton";

export default function Hero() {
  const video = useRef<HTMLVideoElement>(null);

  return (
    <>
      <section id="top" className="hero" aria-label="Blanket Hotels & Resorts">
        <HeroVideo ref={video} />
        <div className="hero__shade" aria-hidden="true" />
      </section>

      {/* Both of these are rendered outside the hero section on purpose: it has overflow:hidden,
          which (since the section itself isn't a transform/filter containing block) still clips
          a position:fixed descendant's hit-testing even though it's positioned relative to the
          viewport — that was silently breaking clicks on the mute button. The booking bar also
          needs to sit outside it to straddle the hero/intro seam without being clipped. */}
      <HeroMuteButton video={video} />
      <div className="hero__booking wrap">
        <BookingBar />
      </div>
    </>
  );
}
