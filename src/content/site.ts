import type { StaticImageData } from "next/image";
import { img } from "./images";

// Everything a guest reads on the homepage lives here, so copy can change without touching layout.
// Text in [brackets] is still waiting for confirmed content from Blanket.

export const site = {
  name: "Blanket Hotels & Resorts",
  shortName: "Blanket",
  tagline: "Nature-led stays in Kerala, India",
  // Set NEXT_PUBLIC_SITE_URL in .env once the domain is final.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.your-domain.com",
  whatsapp: "[WhatsApp number]",
  phone: "[Phone number]",
  email: "[Reservations email]",
  address: "[Registered office address]",
  directBenefit: "[direct-booking benefit]",
};

export const nav = [
  { label: "Stays", href: "#stays", mega: true },
  { label: "Experiences", href: "#experiences" },
  { label: "Destinations", href: "#destinations" },
  { label: "Journeys", href: "#journeys" },
  { label: "Offers", href: "#offers" },
  { label: "Journal", href: "#journal" },
  { label: "Responsible Blanket", href: "#responsible" },
];

export type Stay = {
  slug: string;
  name: string;
  short: string;
  location: string;
  landscape: string;
  line: string;
  rooms: string[];
  highlights: string[];
  image: StaticImageData;
  imageAlt: string;
  gallery: { image: StaticImageData; alt: string; caption: string }[];
  mood: string; // background colour for this resort's chapter
};

export const stays: Stay[] = [
  {
    slug: "blanket-days-thekkady",
    name: "Blanket Days Resort & Spa",
    short: "Blanket Days",
    location: "Thekkady",
    landscape: "Forest & wildlife",
    line: "Stays in the forest country of Thekkady, built around wildlife and quiet mornings.",
    rooms: ["Blanket Nest", "Blanket Pavillion", "Blanket Elettaria", "Honeymoon Villa"],
    highlights: ["Hilltop deck", "Infinity pool", "Ayurveda", "Herping tours"],
    image: img.stayDaysAerial,
    imageAlt: "Aerial view of Blanket Days Resort & Spa, its cottages and infinity pool set inside dense forest in Thekkady",
    gallery: [
      { image: img.stayDaysNest, alt: "Thatched Blanket Nest tree house rising above the forest canopy", caption: "Blanket Nest" },
      { image: img.daysNestWalkway, alt: "Wooden walkway leading through the trees to a Blanket Nest", caption: "The walk in" },
      { image: img.daysHoneymoonPool, alt: "Guest relaxing in the private pool of the Honeymoon Villa", caption: "Honeymoon Villa" },
    ],
    mood: "#1d3427",
  },
  {
    slug: "blanket-riverside-munnar",
    name: "Blanket Riverside Resort & Spa",
    short: "Blanket Riverside",
    location: "Munnar",
    landscape: "River & valley",
    line: "A riverside stay in Munnar's hills, close to plantations, bamboo forest and local life.",
    rooms: ["Riverside Pool Villa", "Riverside Grove Villa", "Garden Cascade Villa"],
    highlights: ["River Babble restaurant", "Riverside deck", "Bamboo rafting", "Tea tasting"],
    image: img.stayRiversideAerial,
    imageAlt: "Blanket Riverside villas on a green hillside above a calm river in Munnar",
    gallery: [
      { image: img.stayRiversideDeck, alt: "Lantern-lit riverside deck at dusk with mist over the valley", caption: "Riverside deck" },
      { image: img.riversidePoolVilla, alt: "Riverside Pool Villa with its private pool above the river", caption: "Pool Villa" },
      { image: img.riversideGroveWindow, alt: "Guest at the window of a Riverside Grove Villa looking over the trees", caption: "Grove Villa" },
    ],
    mood: "#1f3a3a",
  },
  {
    slug: "blanket-hotel-munnar",
    name: "Blanket Hotel & Spa",
    short: "Blanket Munnar",
    location: "Munnar",
    landscape: "Tea hills & waterfall",
    line: "A hotel above the waterfall, wrapped in tea gardens and drifting cloud.",
    rooms: ["Blanket Presidential Suite", "Blanket Valley Club", "Blanket Camellia", "Honeymoon Pavilion"],
    highlights: ["Fall View restaurant", "Infinity pool", "Ayurveda", "Waterfall views"],
    image: img.stayMunnarClouds,
    imageAlt: "Blanket Hotel rising out of low cloud on a forested slope in Munnar",
    gallery: [
      { image: img.stayMunnarSuite, alt: "Bath beside a floor-to-ceiling window looking onto the waterfall", caption: "Presidential Suite" },
      { image: img.munnarSuiteBalcony, alt: "Guest on the Presidential Suite balcony above the waterfall", caption: "The balcony" },
      { image: img.munnarFallView, alt: "Fall View restaurant with tables beside the waterfall valley", caption: "Fall View" },
    ],
    mood: "#2a3b3f",
  },
];

export const experiences = [
  {
    title: "Nature & wildlife",
    text: "Herping tours after dark, birding at first light and forest walks with naturalists who grew up here.",
    image: img.expNatureFrog,
    alt: "Bush frog on a leaf, found on a night herping tour in Thekkady",
    focus: "35% 88%", // keep the frog in frame on tall cards
    tags: ["Herping tour", "Nature walk", "Watch tower"],
  },
  {
    title: "Local culture & craft",
    text: "Kerala attire, kolam and mehendi, taught by the people who keep these traditions alive.",
    image: img.expCultureAttire,
    alt: "Host draping a guest in a traditional Kerala kasavu saree",
    tags: ["Kerala attire", "Kolam", "Mehendi"],
  },
  {
    title: "Food & plantations",
    text: "Walk the cardamom and pepper gardens with our chef, then taste what you picked.",
    image: img.expFoodSpiceGarden,
    alt: "Chef gathering spices among cardamom plants in the resort garden",
    tags: ["Spice plantation walk", "Tea tasting", "Cooking demonstration"],
  },
  {
    title: "Wellness & slow living",
    text: "Ayurveda on the hillside, yoga on the deck, and long, unhurried hours outdoors.",
    image: img.expWellnessAyurveda,
    alt: "Ayurveda therapist preparing a guest for a treatment with misty hills behind",
    tags: ["Ayurveda", "Yoga", "Picnic"],
  },
  {
    title: "Adventure & play",
    text: "Rope walks through the canopy, archery, cycling and bamboo rafting on the river.",
    image: img.expAdventureRope,
    alt: "Guest crossing a rope bridge through the forest canopy",
    tags: ["Rope activities", "Archery", "Bamboo rafting"],
  },
];

// Draft seasonal copy for the high ranges; confirm with the destination team.
export const seasons = [
  {
    id: "winter",
    name: "Cool & clear",
    months: [12, 1, 2],
    image: img.seasonWinter,
    alt: "Morning mist lifting off the river valley at Blanket Riverside",
    summary: "Crisp mornings, clear views and cool nights by the fire. The best season for long walks and wide valley views.",
    thekkady: "Dry forest trails and easy birding. Mornings are cool enough for a jacket.",
    munnar: "Tea hills at their sharpest, with mist in the valleys at dawn.",
  },
  {
    id: "summer",
    name: "Warm & golden",
    months: [3, 4, 5],
    image: img.seasonSummer,
    alt: "Family picnic on a green hilltop overlooking the Thekkady valley",
    summary: "Warm days in the plains, gentler in the hills. Wildlife gathers near water and evenings are long and golden.",
    thekkady: "Wildlife comes to the water. Early forest walks are at their most rewarding.",
    munnar: "Pleasant days among the plantations, a cool escape from the coast.",
  },
  {
    id: "monsoon",
    name: "Monsoon",
    months: [6, 7, 8, 9],
    image: img.seasonMonsoon,
    alt: "Couple under an umbrella at the infinity pool, wrapped in monsoon cloud",
    summary: "The Western Ghats turn deepest green. Rain on the roof, cloud through the trees and waterfalls at full strength.",
    thekkady: "The forest is at its most alive. Night herping tours find frogs everywhere.",
    munnar: "Waterfalls in full flow and the hotel wrapped in cloud. Ayurveda season.",
  },
  {
    id: "post-monsoon",
    name: "After the rains",
    months: [10, 11],
    image: img.seasonWinter,
    alt: "River valley after the rains with mist over the hills",
    summary: "Washed-clean air, full rivers and green everywhere. Quieter roads before the winter season begins.",
    thekkady: "Lush trails and active birdlife as the forest settles after the rains.",
    munnar: "Rivers and falls still full, with clearer skies arriving.",
  },
];

export const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const journey = {
  title: "Hills to forest",
  subtitle: "Munnar to Thekkady",
  // `at` is where the stop sits along the road (0 = start, 1 = end).
  stops: [
    { label: "Blanket Riverside", place: "Munnar", detail: "[N] nights · bamboo rafting and tea tasting", at: 0, image: img.stayRiversideAerial, alt: "Blanket Riverside villas above the river" },
    { label: "Blanket Hotel & Spa", place: "Munnar", detail: "[N] nights · waterfall views and Ayurveda", at: 0.24, image: img.stayMunnarClouds, alt: "Blanket Hotel rising out of the cloud" },
    { label: "The drive south", place: "On the road", detail: "Spice estates and forest roads · [route and drive time]", at: 0.6, image: img.expFoodSpiceGarden, alt: "Cardamom plants in a spice garden" },
    { label: "Blanket Days", place: "Thekkady", detail: "[N] nights · herping tour and spice walk", at: 1, image: img.stayDaysAerial, alt: "Blanket Days among the forest trees in Thekkady" },
  ],
  // Small landscape names written along the road.
  landmarks: [
    { text: "Tea estates", at: 0.11, side: "right" },
    { text: "Cardamom hills", at: 0.44, side: "left" },
    { text: "Periyar forest", at: 0.84, side: "right" },
  ],
  image: img.journeyTeaValley,
  alt: "Tea gardens folding down a valley towards the waterfall in Munnar",
};

export const landscapes = [
  { word: "Forest", place: "Thekkady", stay: "Blanket Days", image: img.landForest, alt: "Blanket Nest tree house in the forest canopy with the Thekkady hills beyond" },
  { word: "River", place: "Munnar", stay: "Blanket Riverside", image: img.landRiver, alt: "River running over rocks below the villas of Blanket Riverside" },
  { word: "Hills", place: "Munnar", stay: "Blanket Hotel & Spa", image: img.landHills, alt: "Waterfall cutting through tea-covered hills in Munnar" },
];

// The photo wall: four columns that drift at different speeds.
export const moments = [
  [
    { image: img.mDeckMist, alt: "Guest on the hilltop deck as mist rises from the valley" },
    { image: img.mKeralaCurry, alt: "Kerala curry served with whole spices" },
    { image: img.mHorseRide, alt: "Horse ride along the garden path beside the river" },
    { image: img.mCandleGazebo, alt: "Candlelit dinner in a forest gazebo at night" },
  ],
  [
    { image: img.mPicnicMist, alt: "Family picnic on the hillside in the mist" },
    { image: img.mPoolSplash, alt: "Guests splashing in the infinity pool" },
    { image: img.mMehendi, alt: "Mehendi being drawn on a guest's hand" },
    { image: img.mWatchTower, alt: "Silhouette of a guest on the watch tower" },
  ],
  [
    { image: img.mYoga, alt: "Morning yoga on the deck above the valley" },
    { image: img.mTeaTasting, alt: "Tea tasting with a local host" },
    { image: img.mPoolRain, alt: "Couple under an umbrella at the pool in the monsoon cloud" },
    { image: img.mParradice, alt: "Guest at the thatched Parradice bar in the garden" },
  ],
  [
    { image: img.mDeckCouple, alt: "Couple sharing breakfast on the hilltop deck" },
    { image: img.mMocktails, alt: "Coloured mocktails on a table by the window" },
    { image: img.mPoolVillaView, alt: "Guest at the pool villa window looking over the river" },
    { image: img.mCandleDeck, alt: "Couple at a candlelit table on the pool deck" },
    { image: img.mPavillionBath, alt: "Bath beside a large window in the Blanket Pavillion" },
  ],
];

export const offers = [
  { title: "Best available rate", text: "[Rate promise and terms]" },
  { title: "A welcome extra", text: "[Complimentary experience, upgrade or credit]" },
  { title: "Flexible planning", text: "[Change and cancellation terms]" },
];

export const journal = [
  {
    category: "History",
    title: "The story of Munnar's tea hills",
    image: img.journalTeaHills,
    alt: "Tea estates folding across the hills of Munnar",
    thumb: img.journalTeaHillsThumb,
    thumbAlt: "Waterfall cutting through Munnar's tea gardens from above",
  },
  {
    category: "Wildlife",
    title: "Living beside the forest in Thekkady",
    image: img.journalForestBird,
    alt: "Bird perched on a branch in the Thekkady forest",
    thumb: img.journalForestThumb,
    thumbAlt: "Tree frog spotted on a night herping tour in Thekkady",
  },
  {
    category: "Seasons",
    title: "A guide to the seasons of the Western Ghats",
    image: img.journalMonsoonGarden,
    alt: "Lamp-lit garden path disappearing into monsoon mist",
    thumb: img.journalSeasonsThumb,
    thumbAlt: "Guest in the garden as monsoon mist rolls over the tea fields",
  },
];

export const commitments = [
  { value: "[—]", label: "Nature and conservation measure" },
  { value: "[—]", label: "Community and CSR measure" },
  { value: "[—]", label: "Local sourcing measure" },
];

export const footerColumns = [
  { title: "Stays", links: [...stays.map((s) => ({ label: s.short, href: "#stays" })), { label: "Map", href: "#map" }] },
  { title: "Explore", links: nav.slice(1, 6).map(({ label, href }) => ({ label, href })) },
  {
    title: "Blanket",
    links: ["Our story", "Responsible Blanket", "Press", "Careers", "Travel partners", "Contact"].map((label) => ({ label, href: label === "Responsible Blanket" ? "#responsible" : "#plan" })),
  },
  { title: "Follow", links: ["Instagram", "Facebook", "YouTube", "LinkedIn"].map((label) => ({ label, href: "#" })) },
];
