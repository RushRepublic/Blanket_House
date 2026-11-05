import Backdrop from "../Backdrop";
import { stays } from "@/content/site";
import { img } from "@/content/images";

// Simple equirectangular projection of the Idukki high ranges (lon 76.2–77.5 E, lat 9.3–10.5 N).
const W = 600;
const H = 560;
const project = (lon: number, lat: number) => ({ x: ((lon - 76.2) / 1.3) * W, y: ((10.5 - lat) / 1.2) * H });

// Approximate positions — confirm exact coordinates for each property before launch.
const pins = [
  { ...project(77.04, 10.03), name: stays[1].short, place: "Munnar", side: "left" as const },
  { ...project(77.07, 10.07), name: stays[2].short, place: "Munnar", side: "right" as const },
  { ...project(77.17, 9.6), name: stays[0].short, place: "Thekkady", side: "right" as const },
];
const airport = project(76.39, 10.15);
const reserves = [
  { ...project(77.08, 10.2), rx: 46, ry: 34, label: "Eravikulam National Park" },
  { ...project(77.22, 9.47), rx: 70, ry: 48, label: "Periyar Tiger Reserve" },
];

// Hand-drawn feeling contour rings around the main hill masses, generated once on the server.
function contours() {
  const peaks = [
    { cx: 400, cy: 140, r: 140, seed: 1.3 },
    { cx: 470, cy: 430, r: 150, seed: 2.7 },
    { cx: 250, cy: 330, r: 110, seed: 4.1 },
  ];
  const paths: string[] = [];
  for (const p of peaks) {
    for (let ring = 1; ring <= 7; ring++) {
      const base = (p.r * ring) / 7;
      const pts: string[] = [];
      for (let a = 0; a <= 64; a++) {
        const t = (a / 64) * Math.PI * 2;
        const r = base * (1 + 0.14 * Math.sin(3 * t + p.seed + ring * 0.4) + 0.07 * Math.sin(5 * t + p.seed * 2));
        pts.push(`${(p.cx + r * Math.cos(t)).toFixed(1)},${(p.cy + r * 0.82 * Math.sin(t)).toFixed(1)}`);
      }
      paths.push(`M${pts.join("L")}Z`);
    }
  }
  return paths;
}

export default function MapSection() {
  const rings = contours();
  const [, bm, bd] = pins;
  const route = `M${bm.x},${bm.y} C ${bm.x + 60},${bm.y + 80} ${bd.x - 70},${bd.y - 120} ${bd.x},${bd.y}`;

  return (
    <section id="map" className="map dark" aria-labelledby="map-title">
      <Backdrop image={img.mapRiversideAerial} shade="full" parallax={0.15} />
      <div className="wrap map__grid">
        <div className="map__copy">
          <p className="eyebrow eyebrow--gold">Find your Blanket</p>
          <h2 id="map-title" className="h2" data-split>
            Three places, one state, easy to combine
          </h2>
          <ul className="map__list">
            {stays.map((s) => (
              <li key={s.slug} data-fade>
                <strong>{s.short}</strong>
                <span>{s.location}</span>
              </li>
            ))}
          </ul>
          <p className="map__note">
            Blanket Riverside and Blanket Hotel &amp; Spa sit minutes apart in the Munnar hills; Blanket Days is a scenic
            drive south through spice country to Thekkady.
          </p>
        </div>

        <figure className="map__figure" data-map>
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="map-svg-title">
            <title id="map-svg-title">
              Illustrated map of the Kerala high ranges showing two Blanket stays in Munnar and one in Thekkady
            </title>
            <g className="map__contours">
              {rings.map((d, i) => (
                <path key={i} d={d} pathLength={1} />
              ))}
            </g>
            {reserves.map((r) => (
              <g key={r.label} className="map__reserve">
                <ellipse cx={r.x} cy={r.y} rx={r.rx} ry={r.ry} />
                <text x={r.x} y={r.y + r.ry + 18} textAnchor="middle">{r.label}</text>
              </g>
            ))}
            <path className="map__route" d={route} pathLength={1} />
            <g className="map__airport">
              <circle cx={airport.x} cy={airport.y} r={5} />
              <text x={airport.x + 12} y={airport.y + 4}>Cochin International Airport</text>
            </g>
            {pins.map((p) => (
              <g key={p.name} className="map__pin" transform={`translate(${p.x} ${p.y})`}>
                <circle className="map__pulse" r={14} />
                <circle className="map__dot" r={7} />
                <text x={p.side === "right" ? 16 : -16} y={5} textAnchor={p.side === "right" ? "start" : "end"}>
                  {p.name}
                </text>
              </g>
            ))}
          </svg>
        </figure>
      </div>
    </section>
  );
}
