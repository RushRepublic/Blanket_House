import SeasonGuide from "../SeasonGuide";

export default function Destinations() {
  return (
    <section id="destinations" className="dest dark" aria-labelledby="dest-title">
      <header className="dest__head wrap">
        <p className="eyebrow eyebrow--gold">Destinations</p>
        <h2 id="dest-title" className="h2" data-split>
          When to come, and what you will see
        </h2>
      </header>
      <SeasonGuide />
    </section>
  );
}
