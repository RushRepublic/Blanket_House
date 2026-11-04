import Image from "next/image";
import Backdrop from "../Backdrop";
import { experiences } from "@/content/site";
import { img } from "@/content/images";

// Mountain view behind a centred heading, with a row of tall photo cards rising from the bottom edge.
export default function Experiences() {
  return (
    <section id="experiences" className="exp dark" aria-labelledby="exp-title">
      <Backdrop image={img.expBgMountainMist} alt="Low cloud drifting over the forested hills around Munnar" shade="soft" parallax={0} />
      {/* Colour grade and film grain over the photo */}
      <div className="exp__veil" aria-hidden="true" />
      <div className="exp__grain" aria-hidden="true" />

      <div className="wrap exp__inner">
        <header className="exp__head">
          <p className="eyebrow eyebrow--gold">Experiences</p>
          <h2 id="exp-title" className="exp__title">
            What do you want to <em>see and do?</em>
          </h2>
          <p className="exp__lede">
            Each experience lists which Blanket stays offer it, so you can start with what you want to do and arrive at the
            right resort.
          </p>
          <a href="#experiences" className="text-link text-link--light">
            Explore all experiences
          </a>
        </header>

        <ul className="exp__cards">
          {experiences.map((e, i) => (
            <li key={e.title} className="exp-card" style={{ "--focus": e.focus } as React.CSSProperties}>
              <a href="#experiences" className="exp-card__link">
                {/* The photo keeps the open card's width; the card only reveals more of it, so it never rescales. */}
                <span className="exp-card__img">
                  <Image src={e.image} alt={e.alt} fill placeholder="blur" sizes="(max-width: 900px) 74vw, 640px" />
                </span>
                <span className="exp-card__shade" aria-hidden="true" />
                <div className="exp-card__copy">
                  <span className="exp-card__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="exp-card__title">{e.title}</h3>
                  <div className="exp-card__more">
                    <div className="exp-card__more-inner">
                      <span className="exp-card__text">{e.text}</span>
                      <span className="exp-card__tags">{e.tags.join(" · ")}</span>
                    </div>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Soft curved edge into the next section */}
      <svg className="exp__wave" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,70 C320,150 620,10 920,60 C1140,98 1300,120 1440,80 L1440,160 L0,160 Z" />
      </svg>
    </section>
  );
}
