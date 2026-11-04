// Geometry for the "Hills to forest" road: a winding hill road with hairpin bends,
// drawn in a 600 × 1000 box. Computed on the server so stop positions are in the HTML.

export const ROUTE_W = 600;
export const ROUTE_H = 1000;

type Pt = { x: number; y: number };

// Hand-placed waypoints; the road passes smoothly through each one.
const WAYPOINTS: Pt[] = [
  { x: 300, y: 40 },
  { x: 430, y: 110 },
  { x: 260, y: 185 },
  { x: 120, y: 255 },
  { x: 300, y: 300 },
  { x: 480, y: 360 },
  { x: 430, y: 455 },
  { x: 200, y: 500 },
  { x: 110, y: 590 },
  { x: 260, y: 660 },
  { x: 470, y: 720 },
  { x: 420, y: 820 },
  { x: 230, y: 870 },
  { x: 300, y: 960 },
];

type Seg = [Pt, Pt, Pt, Pt];

// Catmull-Rom spline → cubic Bézier segments (smooth curves through every waypoint).
function segments(points: Pt[]): Seg[] {
  const segs: Seg[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    segs.push([
      p1,
      { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
      { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
      p2,
    ]);
  }
  return segs;
}

const bez = ([a, b, c, d]: Seg, t: number): Pt => {
  const m = 1 - t;
  return {
    x: m * m * m * a.x + 3 * m * m * t * b.x + 3 * m * t * t * c.x + t * t * t * d.x,
    y: m * m * m * a.y + 3 * m * m * t * b.y + 3 * m * t * t * c.y + t * t * t * d.y,
  };
};

const SEGS = segments(WAYPOINTS);

export const ROAD_PATH =
  `M${SEGS[0][0].x},${SEGS[0][0].y}` +
  SEGS.map(([, b, c, d]) => ` C${b.x.toFixed(1)},${b.y.toFixed(1)} ${c.x.toFixed(1)},${c.y.toFixed(1)} ${d.x},${d.y}`).join("");

// Evenly spaced samples along the road, so "at: 0.5" really means halfway along it.
const SAMPLES: { p: Pt; len: number }[] = (() => {
  const out: { p: Pt; len: number }[] = [];
  let len = 0;
  let prev = SEGS[0][0];
  for (const s of SEGS) {
    for (let i = 1; i <= 60; i++) {
      const p = bez(s, i / 60);
      len += Math.hypot(p.x - prev.x, p.y - prev.y);
      out.push({ p, len });
      prev = p;
    }
  }
  out.unshift({ p: SEGS[0][0], len: 0 });
  return out;
})();
const TOTAL = SAMPLES[SAMPLES.length - 1].len;

/** Point on the road at a fraction of its length, plus the direction of travel in degrees. */
export function pointAt(at: number) {
  const target = Math.min(1, Math.max(0, at)) * TOTAL;
  let i = SAMPLES.findIndex((s) => s.len >= target);
  if (i <= 0) i = 1;
  const a = SAMPLES[i - 1].p;
  const b = SAMPLES[i].p;
  return { x: b.x, y: b.y, angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI };
}

/** Faint hill contours behind the road. */
export function contours() {
  const hills = [
    { cx: 140, cy: 180, r: 150, seed: 1.1 },
    { cx: 470, cy: 520, r: 170, seed: 2.6 },
    { cx: 160, cy: 820, r: 160, seed: 4.2 },
  ];
  const paths: string[] = [];
  for (const h of hills) {
    for (let ring = 1; ring <= 6; ring++) {
      const base = (h.r * ring) / 6;
      const pts: string[] = [];
      for (let a = 0; a <= 72; a++) {
        const t = (a / 72) * Math.PI * 2;
        const r = base * (1 + 0.13 * Math.sin(3 * t + h.seed + ring * 0.5) + 0.06 * Math.sin(5 * t + h.seed * 2));
        pts.push(`${(h.cx + r * Math.cos(t)).toFixed(1)},${(h.cy + r * 0.8 * Math.sin(t)).toFixed(1)}`);
      }
      paths.push(`M${pts.join("L")}Z`);
    }
  }
  return paths;
}
