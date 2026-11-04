import Image from "next/image";
import { landscapes } from "@/content/site";

/*
  A small window opens to fill the screen, then the forest gives way to the river and the hills.
  Without animation (or before it loads) the three landscapes simply stack, so nothing is hidden.
*/
export default function Landscapes() {
  return (
    <section className="lands dark" aria-labelledby="lands-title" data-lands>
      <h2 id="lands-title" className="sr-only">Forest, river and hills: three Blanket landscapes</h2>
      <div className="lands__stage">
        {landscapes.map((l, i) => (
          <div key={l.word} className="lands__slide" data-slide={i}>
            <div className="lands__img">
              <Image src={l.image} alt={l.alt} fill placeholder="blur" sizes="100vw" />
            </div>
            <div className="lands__shade" aria-hidden="true" />
            <div className="lands__text">
              <span className="lands__count" aria-hidden="true">
                {String(i + 1).padStart(2, "0")} — 03
              </span>
              <p className="lands__word">{l.word}</p>
              <p className="lands__caption">
                {l.place} · {l.stay}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
