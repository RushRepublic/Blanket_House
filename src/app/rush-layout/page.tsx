import localFont from "next/font/local";
import Header from "@/components/Header";
import ScrollEffects from "@/components/ScrollEffects";
import MistLayer from "@/components/MistLayer";
import Drizzle from "@/components/Drizzle";
import StructuredData from "@/components/StructuredData";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Landscapes from "@/components/sections/Landscapes";
import Experiences from "@/components/sections/Experiences";
import Stays from "@/components/sections/Stays";
import Moments from "@/components/sections/Moments";
import Destinations from "@/components/sections/Destinations";
import Journeys from "@/components/sections/Journeys";
import Offers from "@/components/sections/Offers";
import Journal from "@/components/sections/Journal";
import Responsible from "@/components/sections/Responsible";
import Reviews from "@/components/sections/Reviews";
import MapSection from "@/components/sections/MapSection";
import Plan from "@/components/sections/Plan";
import Footer from "@/components/sections/Footer";

// Headings on this page use the client's Nexa Rust Sans Black in place of the homepage's Playfair
// Display. Scoped to the .rush-theme wrapper below so the main homepage is unaffected.
const rushDisplay = localFont({
  src: "../../assets/fonts/NexaRustSansBlack.otf",
  variable: "--font-rush-display",
  display: "swap",
});

// A second design option for the client, reachable only by its direct URL (never linked in the
// nav or sitemap). Starts as an exact copy of the homepage so the two can be compared fairly;
// this is the file to diverge from once the alternate layout work begins.
export default function RushLayout() {
  return (
    <div className={`rush-theme ${rushDisplay.variable}`}>
      <StructuredData />
      <Header />
      <main id="main">
        <Hero />
        <Intro />
        <Landscapes />
        <Experiences />
        <Stays />
        <Moments />
        <Destinations />
        <Journeys />
        <Offers />
        <Journal />
        <Responsible />
        <Reviews />
        <MapSection />
        <Plan />
      </main>
      <Footer />

      {/* Phone-only booking bar */}
      <nav className="mobile-bar" aria-label="Quick booking">
        <a href="#book" className="btn btn--gold">Book now</a>
        <a href="#plan" className="btn btn--line-light">Enquire</a>
      </nav>

      <MistLayer />
      <Drizzle />
      <ScrollEffects />
    </div>
  );
}
