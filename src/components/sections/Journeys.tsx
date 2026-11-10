import JourneyBackdrop from "../JourneyBackdrop";
import JourneyRoad from "../JourneyRoad";
import { journey } from "@/content/site";

export default function Journeys() {
  return (
    <section id="journeys" className="journey dark" aria-labelledby="journey-title">
      <JourneyBackdrop />

      <div className="wrap journey__grid">
        <header className="journey__head">
          <p className="eyebrow eyebrow--gold">Journeys</p>
          <h2 id="journey-title" className="h2" data-split>
            One trip, more than one Blanket
          </h2>
          <p className="journey__intro" data-fade>
            Pair the river, the waterfall and the forest in a single trip, with transfers and experiences planned for you.
          </p>
          <p className="journey__feature" data-fade>
            <span className="eyebrow eyebrow--gold">Featured journey</span>
            <span className="journey__feature-title">
              {journey.title}: <em>{journey.subtitle}</em>
            </span>
          </p>
          <div className="journey__ctas" data-fade>
            <a href="#plan" className="btn btn--gold">View journey</a>
            <a href="#plan" className="text-link text-link--light">Enquire</a>
          </div>
        </header>

        <JourneyRoad />
      </div>
    </section>
  );
}
