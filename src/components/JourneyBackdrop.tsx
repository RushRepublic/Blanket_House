import Image from "next/image";
import { journey } from "@/content/site";

// Same shape as Backdrop, but stacks one photo per stop and crossfades between them as the car
// on JourneyRoad passes each one — see ScrollEffects.tsx's "Journeys: road trip" block, which
// toggles the .is-active class.
export default function JourneyBackdrop() {
  return (
    <div className="backdrop journey__bg" aria-hidden="true" data-journey-bg>
      {journey.stops.map((s, i) => (
        <div key={s.label} className={`backdrop__img journey__bg-img${i === 0 ? " is-active" : ""}`} data-stop-index={i}>
          <Image src={s.image} alt={s.alt} fill sizes="100vw" placeholder="blur" priority={i === 0} />
        </div>
      ))}
      <div className="backdrop__shade backdrop__shade--left" />
    </div>
  );
}
