// Resizes the original photography into web-ready masters in src/assets/images.
// Next.js then generates AVIF/WebP at every screen size from these masters.
// Run: npm run images
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_ROOT = path.resolve(process.cwd(), '..', 'Images');
const OUT_DIR = path.resolve(process.cwd(), 'src', 'assets', 'images');
const MAX_EDGE = 2560;

// slug -> path inside any "Motherwebsite" folder
const PICKS = {
  'hero-hilltop-mist': 'Blanket Days Thekkady/Facilities/Hilltop Deck/NPS00221.jpg',
  'intro-coffee-blossom': 'Blanket Days Thekkady/Experiences/DSC02686.jpg',
  'intro-pepper-vine': 'Blanket Days Thekkady/Experiences/NPS09341.jpg',

  'exp-nature-frog': 'Blanket Days Thekkady/Experiences/Herping Tour/DSC02605.jpg',
  'exp-culture-attire': 'Blanket Riverside Munnar/Blanket Riverside Activities/Kerala Attire Demonstration.jpg',
  'exp-food-spice-garden': 'Blanket Days Thekkady/Experiences/NPS09328.jpg',
  'exp-wellness-ayurveda': 'Blanket Days Thekkady/Facilities/Ayurveda/NPS00845.jpg',
  'exp-adventure-rope': 'Blanket Riverside Munnar/Blanket Riverside Activities/Adventure Activities/Swing Walk.jpg',

  'stay-days-aerial': 'Blanket Days Thekkady/Property Exterior/DJI_20260920063316_0080_D.jpg',
  'stay-days-nest': 'Blanket Days Thekkady/Rooms/Blanket Nest/DJI_20260924070846_0161_D.jpg',
  'stay-riverside-aerial': 'Blanket Riverside Munnar/Blanket Riverside Exterior View/Main Image Ariel View.jpg',
  'stay-riverside-deck': 'Blanket Riverside Munnar/Blanket Riverside Facilities/Riverside Deck/RIVERSIDE 143.jpg',
  'stay-munnar-clouds': 'Blanket Munnar/Blanket Munnar/Exterior/BLANKET 41.jpg',
  'stay-munnar-suite': 'Blanket Munnar/Blanket Munnar/Rooms/Blanket Presidential Suite/BLANKET 22.jpg',

  'season-monsoon': 'Blanket Munnar/Blanket Munnar/Infinity Pool/(24).jpg',
  'season-winter': 'Blanket Riverside Munnar/Blanket Riverside Exterior View/Aerial View.jpg',
  'season-summer': 'Blanket Days Thekkady/Facilities/Picnic/DJI_20260925165346_0173_D.jpg',

  'journey-tea-valley': 'Blanket Munnar/Blanket Munnar/Exterior/BLANKET 36.jpg',
  'offer-pool-villa-sunset': 'Blanket Riverside Munnar/Blanket Riverside Rooms/Riverside Pool Villa/Riverside Pool Villa View.jpeg',

  'journal-tea-hills': 'Blanket Munnar/Blanket Munnar/Exterior/BLANKET 37.jpg',
  'journal-forest-bird': 'Blanket Days Thekkady/Experiences/NPS09001.jpg',
  'journal-monsoon-garden': 'Blanket Munnar/Blanket Munnar/Garden/BLANKET 29.jpg',

  // Journal card thumbnails — distinct from each story's background photo above
  'journal-tea-hills-thumb': 'Blanket Munnar/Blanket Munnar/Exterior/BLANKET 2.jpg',
  'journal-forest-thumb': 'Blanket Days Thekkady/Experiences/Herping Tour/DSC02611.jpg',
  'journal-seasons-thumb': 'Blanket Munnar/Blanket Munnar/Garden/BLANKET 31.jpg',

  // Stays section intro background
  'stays-head-waterfall': 'Blanket Riverside Munnar/Blanket Riverside Exterior View/RIVERSIDE 86.jpg',

  'responsible-bamboo': 'Blanket Riverside Munnar/Blanket Riverside Activities/Nature Walk/Nature Walk - Bamboo Forest.jpg',
  'plan-riverside-night': 'Blanket Riverside Munnar/Blanket Riverside Exterior View/RIVERSIDE 133.jpg',

  // Full-screen section backgrounds
  'intro-hilltop-aerial': 'Blanket Days Thekkady/Facilities/Hilltop Deck/DJI_20260926063730_0199_D.jpg',
  'land-forest': 'Blanket Days Thekkady/Rooms/Blanket Nest/DJI_20260925062209_0096_D.jpg',
  'land-river': 'Blanket Riverside Munnar/Blanket Riverside Exterior View/RIVERSIDE 139.jpg',
  'land-hills': 'Blanket Munnar/Blanket Munnar/Exterior/(21).jpg',
  'reviews-riverside-dusk': 'Blanket Riverside Munnar/Blanket Riverside Exterior View/RIVERSIDE 142.jpg',
  'map-riverside-aerial': 'Blanket Riverside Munnar/Blanket Riverside Exterior View/RIVERSIDE 92.jpg',

  'exp-bg-mountain-mist': 'Blanket Riverside Munnar/Blanket Riverside Exterior View/RIVERSIDE 150.jpg',

  // Resort galleries
  'days-nest-walkway': 'Blanket Days Thekkady/Rooms/Blanket Nest/NPS00615.jpg',
  'days-honeymoon-pool': 'Blanket Days Thekkady/Rooms/Honeymoon Villa/NPS00906.jpg',
  'riverside-pool-villa': 'Blanket Riverside Munnar/Blanket Riverside Rooms/Riverside Pool Villa/RIVERSIDE 122.jpg',
  'riverside-grove-window': 'Blanket Riverside Munnar/Blanket Riverside Rooms/Riverside Grove Villa/RIVERSIDE 115.jpg',
  'munnar-suite-balcony': 'Blanket Munnar/Blanket Munnar/Rooms/Blanket Presidential Suite/BLANKET 23.jpg',
  'munnar-fall-view': 'Blanket Munnar/Blanket Munnar/Fall View Restaurant/BLANKET 12.jpg',

  // Moments wall
  'm-deck-mist': 'Blanket Days Thekkady/Facilities/Hilltop Deck/NPS00255.jpg',
  'm-deck-couple': 'Blanket Days Thekkady/Facilities/Hilltop Deck/NPS00383.jpg',
  'm-pool-splash': 'Blanket Days Thekkady/Facilities/Infinity Pool/NPS09677.jpg',
  'm-parradice': 'Blanket Days Thekkady/Facilities/Parradice/NPS09523.jpg',
  'm-picnic-mist': 'Blanket Days Thekkady/Facilities/Picnic/NPS00872.jpg',
  'm-yoga': 'Blanket Days Thekkady/Facilities/Yoga/NPS00228.jpg',
  'm-candle-gazebo': 'Blanket Days Thekkady/Facilities/Candle Light Dinner/NPS00401.jpg',
  'm-candle-deck': 'Blanket Days Thekkady/Facilities/Candle Light Dinner/NPS09786.jpg',
  'm-kerala-curry': 'Blanket Days Thekkady/Restaurant/NPS00046.jpg',
  'm-mocktails': 'Blanket Days Thekkady/Restaurant/NPS00742.jpg',
  'm-pool-rain': 'Blanket Munnar/Blanket Munnar/Infinity Pool/(26).jpg',
  'm-horse-ride': 'Blanket Riverside Munnar/Blanket Riverside Activities/Horse Ride/Horse Riding Activity.jpg',
  'm-mehendi': 'Blanket Riverside Munnar/Blanket Riverside Activities/Mehendi Art.jpg',
  'm-tea-tasting': 'Blanket Riverside Munnar/Blanket Riverside Activities/Tea Tasting.jpg',
  'm-watch-tower': 'Blanket Riverside Munnar/Blanket Riverside Activities/Watch Tower/Watch Tower Experience.JPG',
  'm-pool-villa-view': 'Blanket Riverside Munnar/Blanket Riverside Rooms/Riverside Pool Villa/RIVERSIDE 121.jpg',
  'm-pavillion-bath': 'Blanket Days Thekkady/Rooms/Blanket Pavillion/NPS00469.jpg',
  'm-outdoor-games': 'Blanket Riverside Munnar/Blanket Riverside Activities/Outdoor Games.jpg',
  'm-viewpoint-umbrella': 'Blanket Munnar/Blanket Munnar/Infinity Pool/(28).jpg',
  'm-oven-pizza': 'Blanket Days Thekkady/Facilities/The Oven Pizza Counter/NPS09613.jpg',
};

function findSource(rel) {
  for (const batch of fs.readdirSync(SOURCE_ROOT)) {
    const candidate = path.join(SOURCE_ROOT, batch, 'Motherwebsite', rel);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const [slug, rel] of Object.entries(PICKS)) {
  const out = path.join(OUT_DIR, `${slug}.jpg`);
  if (fs.existsSync(out)) { console.log('skip  ', slug); continue; }
  const src = findSource(rel);
  if (!src) { console.warn('MISSING', rel); continue; }
  const info = await sharp(src, { failOn: 'none', limitInputPixels: false })
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true, progressive: true })
    .toFile(out);
  console.log('wrote ', slug, `${info.width}x${info.height}`, `${(info.size / 1024).toFixed(0)}KB`);
}

// Social share image (1200x630) from the hero
const og = path.resolve(process.cwd(), 'src', 'app', 'opengraph-image.jpg');
if (!fs.existsSync(og)) {
  await sharp(path.join(OUT_DIR, 'hero-hilltop-mist.jpg')).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82, mozjpeg: true }).toFile(og);
  console.log('wrote  opengraph-image.jpg');
}
