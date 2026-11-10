import Header from "@/components/Header";
import ScrollEffects from "@/components/ScrollEffects";
import MistLayer from "@/components/MistLayer";
import Drizzle from "@/components/Drizzle";
import StructuredData from "@/components/StructuredData";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
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

// The homepage is fully pre-rendered on the server: every heading, paragraph, link and image
// is in the HTML that Google receives. Animation only runs after the page has loaded.
export default function Home() {
  return (
    <>
      <StructuredData />
      <Header />
      <main id="main">
        <Hero />
        <Intro />
        <Stays />
        <Destinations />
        <Experiences />
        <Moments />
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
    </>
  );
}
