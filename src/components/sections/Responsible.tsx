import Backdrop from "../Backdrop";
import { commitments } from "@/content/site";
import { img } from "@/content/images";

export default function Responsible() {
  return (
    <section id="responsible" className="resp dark" aria-labelledby="resp-title">
      <Backdrop image={img.responsibleBamboo} alt="Guests on a guided walk through the bamboo forest near Blanket Riverside" shade="left" parallax={0.22} />
      <div className="wrap resp__inner">
        <p className="eyebrow eyebrow--gold">Responsible Blanket</p>
        <h2 id="resp-title" className="h2 resp__title" data-split>
          Looking after the places we stay in
        </h2>
        <p className="resp__lede" data-fade>
          Our stays depend on healthy forests, rivers and communities. Here is how we work with them.
        </p>
        <dl className="resp__stats">
          {commitments.map((c) => (
            <div key={c.label} data-fade>
              <dt>{c.label}</dt>
              <dd>{c.value}</dd>
            </div>
          ))}
        </dl>
        <a href="#responsible" className="text-link text-link--light">Read our commitments</a>
      </div>
    </section>
  );
}
