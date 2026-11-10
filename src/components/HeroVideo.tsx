"use client";

import { forwardRef } from "react";

const HeroVideo = forwardRef<HTMLVideoElement>(function HeroVideo(_props, ref) {
  return (
    <div className="hero__media">
      <video
        ref={ref}
        src="/video/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        aria-hidden="true"
      />
    </div>
  );
});

export default HeroVideo;
