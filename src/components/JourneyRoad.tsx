import { journey } from "@/content/site";

// A decorative road (not a literal map) from Munnar to Thekkady: the line draws itself and a
// car travels along it as the Journeys section scrolls past, pausing visually at each of the
// four stops baked into journey.stops (see src/content/site.ts). Positions are computed from
// the path's own geometry at scroll time (see ScrollEffects.tsx's "Journeys: road trip" block),
// so the `d` below only needs to read clearly as one road winding steadily downhill — a gentle,
// unambiguous serpentine, not a tangle of sharp reversals.
const ROAD_D =
  "M70,25 C140,50 150,90 110,120 C60,155 50,200 110,230 " +
  "C180,265 190,310 130,350 C70,390 60,430 120,465 " +
  "C180,500 190,545 140,580 C110,600 150,615 190,635";

export default function JourneyRoad() {
  return (
    <svg className="journey-road" viewBox="-20 0 270 660" data-route aria-hidden="true">
      {/* Soft wide shoulder gives the thin route line actual road width instead of reading as
          a single drawn stroke. */}
      <path className="journey-road__surface" d={ROAD_D} />
      <path className="journey-road__path" d={ROAD_D} />

      {journey.landmarks.map((l) => (
        <g key={l.text} className={`journey-road__mark journey-road__mark--${l.side}`} data-at={l.at}>
          <circle r="2.4" />
          <text x={l.side === "right" ? 10 : -10} y="4" textAnchor={l.side === "right" ? "start" : "end"}>
            {l.text}
          </text>
        </g>
      ))}

      {journey.stops.map((s) => {
        const toSide = s.side === "right" ? 16 : -16;
        const anchor = s.side === "right" ? "start" : "end";
        return (
          <g key={s.label} className="journey-road__stop" data-at={s.at}>
            <circle className="journey-road__dot" r="6" />
            <text className="journey-road__place" x={toSide} y="-6" textAnchor={anchor}>{s.place}</text>
            <text className="journey-road__label" x={toSide} y="10" textAnchor={anchor}>{s.label}</text>
          </g>
        );
      })}

      <g className="journey-road__car">
        <path d="M-9,-3 H9 L7,-7 H3 L1,-10 H-1 L-3,-7 H-7 Z" />
        <circle cx="-5" cy="3" r="2.2" />
        <circle cx="5" cy="3" r="2.2" />
      </g>
    </svg>
  );
}
