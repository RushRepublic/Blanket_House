import Image from "next/image";
import { moments } from "@/content/site";

// A wall of guest moments in four columns drifting at different speeds, with the heading held in the centre.
export default function Moments() {
  return (
    <section className="moments dark" aria-labelledby="moments-title">
      <div className="moments__head">
        <div className="moments__head-inner">
          <p className="eyebrow eyebrow--gold">Days at Blanket</p>
          <h2 id="moments-title" className="moments__title">
            Slow mornings, <em>long evenings</em>
          </h2>
          <p className="moments__sub">Mist on the deck, spice in the kitchen, candles by the pool.</p>
        </div>
      </div>

      <div className="moments__cols">
        {moments.map((col, c) => (
          <ul key={c} className="moments__col" data-drift={[-14, 12, -20, 16][c]}>
            {col.map((m) => (
              <li key={m.alt} className="moments__item">
                <Image src={m.image} alt={m.alt} fill placeholder="blur" sizes="(max-width: 900px) 50vw, 25vw" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
