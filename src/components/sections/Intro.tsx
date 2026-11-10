import Backdrop from "../Backdrop";
import { img } from "@/content/images";

const statement = "A different stay in every landscape, one way of being in nature.";

export default function Intro() {
  return (
    <section id="intro" className="intro dark" aria-labelledby="intro-title">
      <Backdrop image={img.introHilltopAerial} shade="full" parallax={0} />

      <div className="intro__stage wrap">
        <p className="eyebrow eyebrow--gold">Blanket Hotels &amp; Resorts</p>
        <h2 id="intro-title" className="intro__statement" data-read>
          {statement.split(" ").map((word, i) => (
            <span key={i} className="read-w">
              {word}{" "}
            </span>
          ))}
        </h2>
        <div className="intro__copy">
          <p className="intro__lede">
            Every Blanket stay is shaped by the place around it: the forest, the river, the hills and the people who live
            beside them. Choose a place first, then choose how you want to spend your days.
          </p>
          <p>
            It began in 2017 with a single hotel above a waterfall in Munnar, built slowly and by hand out of respect
            for terrain that doesn&apos;t welcome heavy machinery. That same instinct now shapes every Blanket address,
            with a goal of 15 resorts across Kerala and its neighbouring states by 2030.
          </p>
          <a href="#responsible" className="text-link text-link--light">Our story and commitments</a>
        </div>
      </div>
    </section>
  );
}
