import Image from "next/image";
import { stays } from "@/content/site";

export default function Stays() {
  return (
    <section id="stays" className="stays dark" aria-labelledby="stays-title">
      <header className="stays__head wrap">
        <p className="eyebrow eyebrow--gold">Stays</p>
        <h2 id="stays-title" className="h2 stays__title" data-split>
          Choose your landscape
        </h2>
        <p className="stays__sub" data-fade>
          Three places, three different worlds. A forest in Thekkady, a river and a waterfall in the hills of Munnar.
        </p>
      </header>

      <div className="chapters">
        {stays.map((s, i) => [
          <article
            key={s.slug}
            className="chapter"
            style={{ "--mood": s.mood, zIndex: i + 1 } as React.CSSProperties}
            aria-labelledby={`stay-${s.slug}`}
          >
            <div className="chapter__media">
              <Image src={s.image} alt={s.imageAlt} fill placeholder="blur" sizes="100vw" />
            </div>
            <div className="chapter__shade" aria-hidden="true" />
            <div className="chapter__dim" aria-hidden="true" />
            <span className="chapter__ghost" aria-hidden="true">{s.location}</span>

            <div className="chapter__body wrap">
              <div className="chapter__main">
                <p className="eyebrow eyebrow--gold">
                  <span className="chapter__index">{String(i + 1).padStart(2, "0")} / {String(stays.length).padStart(2, "0")}</span>
                  {s.location} · {s.landscape}
                </p>
                <h3 id={`stay-${s.slug}`} className="chapter__name">
                  {s.name}
                </h3>
                <p className="chapter__line">{s.line}</p>
                <dl className="chapter__facts">
                  <div>
                    <dt>Stay in</dt>
                    <dd>{s.rooms.join(" · ")}</dd>
                  </div>
                  <div>
                    <dt>Don&apos;t miss</dt>
                    <dd>{s.highlights.join(" · ")}</dd>
                  </div>
                </dl>
                <div className="chapter__ctas">
                  <a href="#stays" className="btn btn--gold">Explore {s.short}</a>
                  <a href="#book" className="text-link text-link--light">Book</a>
                </div>
              </div>
            </div>
          </article>,
          // Empty scroll space that keeps each resort on screen for a while before the next one slides over it.
          <div key={`${s.slug}-dwell`} className="chapter-dwell" aria-hidden="true" />,
        ])}
      </div>
    </section>
  );
}
