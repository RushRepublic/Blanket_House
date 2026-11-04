import Backdrop from "../Backdrop";
import { offers } from "@/content/site";
import { img } from "@/content/images";

export default function Offers() {
  return (
    <section id="offers" className="offers dark" aria-labelledby="offers-title">
      <Backdrop
        image={img.offerPoolVillaSunset}
        alt="Private pool of a Riverside Pool Villa at sunset, with the hills glowing behind"
        shade="left"
      />
      <div className="wrap offers__grid">
        <header className="offers__head">
          <p className="eyebrow eyebrow--gold">Offers</p>
          <h2 id="offers-title" className="h2" data-split>
            Book direct, stay better
          </h2>
          <div className="offers__seasonal" data-fade>
            <span className="eyebrow eyebrow--gold">Seasonal offer</span>
            <span className="offers__seasonal-title">[Offer name and dates]</span>
            <a href="#offers" className="btn btn--gold">See all offers</a>
          </div>
        </header>
        <ol className="offers__list">
          {offers.map((o, i) => (
            <li key={o.title} data-fade>
              <span className="offers__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3>{o.title}</h3>
              <p className="placeholder">{o.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
