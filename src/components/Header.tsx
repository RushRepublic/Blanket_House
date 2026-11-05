"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Logo from "./Logo";
import { lockScroll } from "./SmoothScroll";
import { nav, site, stays, journey } from "@/content/site";

const byLandscape = ["Forest and wildlife", "Tea hills and plantations", "River and valley"];
const byTrip = ["Couples", "Families", "Celebrations and weddings", "Long stays"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [preview, setPreview] = useState(0);
  const lastY = useRef(0);
  const closeTimer = useRef<number | undefined>(undefined);

  // Transparent over the hero, glass after it. Hides as soon as the visitor scrolls down and stays
  // hidden until they deliberately scroll back up (or return to the top). Tiny back-and-forth
  // movements at the end of a smooth scroll are ignored, so it never flickers back by accident.
  useEffect(() => {
    let travel = 0; // distance scrolled in the current direction
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      lastY.current = y;
      setScrolled(y > 12);
      setSolid(y > window.innerHeight * 0.75);

      if (y < 80) {
        setHidden(false);
        travel = 0;
        return;
      }
      travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
      if (travel > 10) setHidden(true);
      else if (travel < -60) setHidden(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeAll = useCallback(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAll();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeAll]);

  useEffect(() => {
    lockScroll(mobileOpen);
  }, [mobileOpen]);

  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 180);
  };

  const state = [
    "site-header",
    scrolled ? "is-scrolled" : "",
    solid || megaOpen ? "is-solid" : "",
    hidden && !megaOpen && !mobileOpen ? "is-hidden" : "",
    mobileOpen ? "is-menu-open" : "",
  ].join(" ");

  return (
    <>
      <header className={state}>
        <div className="site-header__inner">
          <button
            type="button"
            className="burger"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span />
            <span />
          </button>

          <a href="#top" className="site-header__logo" aria-label="Blanket Hotels & Resorts, home" onClick={closeAll}>
            <Logo />
          </a>

          <nav className="main-nav" aria-label="Main">
            <ul>
              {nav.map((item) =>
                item.mega ? (
                  <li key={item.label} onMouseEnter={openMega} onMouseLeave={scheduleClose}>
                    <button
                      type="button"
                      className="main-nav__link"
                      aria-expanded={megaOpen}
                      aria-controls="mega-stays"
                      onClick={() => setMegaOpen((o) => !o)}
                    >
                      {item.label}
                    </button>
                  </li>
                ) : (
                  <li key={item.label}>
                    <a className="main-nav__link" href={item.href}>
                      {item.label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="site-header__actions">
            <a href="#plan" className="text-link site-header__enquire">
              Enquire
            </a>
            <a href="#book" className="btn btn--gold btn--sm">
              Book<span className="hide-sm">&nbsp;now</span>
            </a>
          </div>
        </div>

        {/* Stays mega-menu */}
        <div
          id="mega-stays"
          className={`mega ${megaOpen ? "is-open" : ""}`}
          onMouseEnter={openMega}
          onMouseLeave={scheduleClose}
          aria-hidden={!megaOpen}
          inert={!megaOpen}
        >
          <div className="mega__inner">
            <div className="mega__col">
              <p className="eyebrow">By destination</p>
              <ul>
                {stays.map((s, i) => (
                  <li key={s.slug}>
                    <a href="#stays" className="mega__stay" onMouseEnter={() => setPreview(i)} onFocus={() => setPreview(i)} onClick={closeAll}>
                      <span className="mega__place">{s.location}</span>
                      <span className="mega__name">{s.name}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#map" className="text-link" onClick={closeAll}>
                    All stays on the map
                  </a>
                </li>
              </ul>
            </div>
            <div className="mega__col">
              <p className="eyebrow">By landscape</p>
              <ul>
                {byLandscape.map((l) => (
                  <li key={l}>
                    <a href="#stays" onClick={closeAll}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mega__col">
              <p className="eyebrow">By trip</p>
              <ul>
                {byTrip.map((l) => (
                  <li key={l}>
                    <a href="#plan" onClick={closeAll}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <a href="#journeys" className="mega__feature" onClick={closeAll}>
              <span className="mega__photos">
                {stays.map((s, i) => (
                  <Image
                    key={s.slug}
                    src={s.image}
                    alt=""
                    fill
                    sizes="360px"
                    className={i === preview ? "is-active" : ""}
                  />
                ))}
              </span>
              <span className="eyebrow">Featured journey</span>
              <span className="mega__feature-title">
                {journey.title}: {journey.subtitle}
              </span>
            </a>
          </div>
        </div>
      </header>

      <div className={`mega-scrim ${megaOpen ? "is-open" : ""}`} onClick={() => setMegaOpen(false)} aria-hidden="true" />

      {/* Full-screen mobile menu */}
      <div id="mobile-menu" className={`mobile-menu ${mobileOpen ? "is-open" : ""}`} aria-hidden={!mobileOpen} inert={!mobileOpen}>
        <nav aria-label="Mobile">
          <ul className="mobile-menu__list">
            {nav.map((item, i) => (
              <li key={item.label} style={{ transitionDelay: mobileOpen ? `${0.12 + i * 0.05}s` : "0s" }}>
                <a href={item.href} onClick={closeAll}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu__foot">
          <a href="#plan" onClick={closeAll}>WhatsApp {site.whatsapp}</a>
          <span>{site.phone}</span>
        </div>
      </div>
    </>
  );
}
