import Image from "next/image";
import BookingBar from "../BookingBar";
import { img } from "@/content/images";

export default function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        {/* Replace with the hero film (mist over the tea hills) when it is ready; keep this photo as its poster. */}
        <Image
          src={img.heroHilltopMist}
          alt="Morning mist rolling over the forested valley below the hilltop deck at Blanket Days, Thekkady"
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          quality={80}
        />
      </div>
      <div className="hero__shade" aria-hidden="true" />

      <div className="hero__content wrap">
        <p className="eyebrow eyebrow--gold hero__eyebrow">Blanket Hotels &amp; Resorts · Kerala</p>
        <h1 id="hero-title" className="hero__title">
          <span className="hero__line"><span>Stay inside</span></span>
          <span className="hero__line"><span><em>the landscape.</em></span></span>
        </h1>
        <div className="hero__foot">
          <p className="hero__lede">
            Nature-led stays in Kerala&apos;s hills, forests and rivers, with wildlife, local culture and slow days outdoors at
            the centre of every visit.
          </p>
          <div className="hero__ctas">
            <a href="#stays" className="btn btn--gold">Explore our stays</a>
            <a href="#experiences" className="text-link text-link--light">Browse experiences</a>
          </div>
        </div>
      </div>

      <div className="hero__booking wrap">
        <BookingBar />
      </div>

      <a href="#intro" className="hero__scroll" aria-label="Scroll to the next section">
        <span>Scroll</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
