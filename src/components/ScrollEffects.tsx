"use client";

import { gsap, ScrollTrigger, SplitText, useGSAP, EASE } from "@/lib/gsap";

/*
  All scroll animation for the homepage lives here. Sections stay server-rendered and only carry
  data attributes or class names; this component reads them after load:

  data-split      heading rises line by line
  data-fade       block fades up
  data-parallax   background photo drifts at a different speed (value = strength)
  data-read       words brighten as the statement is scrolled past
  data-lands      forest → river → hills sequence (pinned)
  data-route      journey line draws itself
  data-journal    background photo follows the story in view
  data-map        map contours, route and pins draw in
  data-drift      photo-wall columns move at different speeds

  Visitors who ask for reduced motion get the finished page with no movement.
*/
export default function ScrollEffects() {
  useGSAP(() => {
    // Belt-and-braces: in dev, React mounts this component, tears it down, then mounts it again
    // (Strict Mode's double-invoke check). If any ScrollTrigger from that first pass is still
    // registered when the pinned sections below are recreated, GSAP's internal bookkeeping for
    // stacked `pin: true` triggers can end up reading a stale array slot and throw deep inside
    // ScrollTrigger. Clearing anything left over before building this instance's triggers avoids it.
    ScrollTrigger.getAll().forEach((st) => st.kill());

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 900px)",
      },
      (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;

        /* ---------- Shared effects ---------- */

        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.3,
                stagger: 0.09,
                ease: EASE,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              }),
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
          gsap.from(el, {
            y: 40,
            autoAlpha: 0,
            duration: 1.2,
            ease: EASE,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = parseFloat(el.dataset.parallax || "0.15") * 100;
          gsap.fromTo(
            el,
            { yPercent: -amount / 2 },
            {
              yPercent: amount / 2,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        /* ---------- Hero: photo sinks and darkens, title lifts away ---------- */
        gsap
          .timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } })
          .to(".hero__media", { yPercent: 25, scale: 1.1, ease: "none" }, 0)
          .to(".hero__shade", { opacity: 0.9, ease: "none" }, 0)
          .to(".hero__content", { yPercent: -25, autoAlpha: 0, ease: "none" }, 0)
          .to(".hero__booking", { yPercent: -40, autoAlpha: 0, ease: "none" }, 0);

        /* ---------- Intro: pinned; the statement brightens word by word ---------- */
        const words = gsap.utils.toArray<HTMLElement>(".intro .read-w");
        if (desktop) {
          gsap
            .timeline({
              scrollTrigger: { trigger: ".intro", start: "top top", end: "+=160%", pin: true, scrub: 0.6 },
            })
            .fromTo(".intro .backdrop__img", { scale: 1.3 }, { scale: 1, ease: "none", duration: 1 }, 0)
            .fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.05, ease: "none", duration: 0.3 }, 0.05)
            .fromTo(".intro__float--a", { yPercent: 70 }, { yPercent: -50, ease: "none", duration: 1 }, 0)
            .fromTo(".intro__float--b", { yPercent: 140 }, { yPercent: -90, ease: "none", duration: 1 }, 0)
            .from(".intro__copy", { y: 60, autoAlpha: 0, ease: "power2.out", duration: 0.3 }, 0.65);
        } else {
          gsap.fromTo(words, { opacity: 0.14 }, {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: ".intro__statement", start: "top 80%", end: "bottom 45%", scrub: true },
          });
        }

        /* ---------- Landscapes: a window opens, then forest → river → hills ---------- */
        const lands = document.querySelector<HTMLElement>("[data-lands]");
        if (lands) {
          lands.classList.add("lands--anim");
          const slides = gsap.utils.toArray<HTMLElement>(".lands__slide", lands);
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: lands, start: "top top", end: `+=${slides.length * 110}%`, pin: true, scrub: 0.8 },
          });
          tl.fromTo(
            slides[0].querySelector(".lands__img"),
            { clipPath: "inset(26% 32% 26% 32% round 20px)" },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1 },
          )
            .fromTo(slides[0].querySelector(".lands__img img"), { scale: 1.35 }, { scale: 1, duration: 1 }, 0)
            .from(slides[0].querySelector(".lands__text"), { yPercent: 30, autoAlpha: 0, duration: 0.5 }, 0.45);

          slides.slice(1).forEach((slide, i) => {
            const at = 1.4 + i * 1.4;
            tl.to(slides[i].querySelector(".lands__text"), { yPercent: -40, autoAlpha: 0, duration: 0.4 }, at)
              .fromTo(slide, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, at)
              .fromTo(slide.querySelector(".lands__img img"), { scale: 1.3, yPercent: 10 }, { scale: 1, yPercent: 0, duration: 1 }, at)
              .from(slide.querySelector(".lands__text"), { yPercent: 40, autoAlpha: 0, duration: 0.5 }, at + 0.5);
          });
          tl.to({}, { duration: 0.4 }); // short hold on the last landscape
        }

        /* ---------- Experiences: tall photo cards rise into place over the mountain view ---------- */
        const cards = gsap.utils.toArray<HTMLElement>(".exp-card");
        // Heading and text arrive as soon as the section enters, so the photo never shows on its own.
        gsap.from(".exp__head > *", {
          y: 40,
          autoAlpha: 0,
          duration: 1.2,
          stagger: 0.08,
          ease: EASE,
          scrollTrigger: { trigger: ".exp", start: "top 85%", once: true },
        });
        if (cards.length) {
          const mid = (cards.length - 1) / 2;
          gsap.from(cards, {
            yPercent: 40,
            rotate: (i) => (i - mid) * 2.5,
            autoAlpha: 0,
            duration: 1.5,
            stagger: 0.1,
            ease: EASE,
            scrollTrigger: { trigger: ".exp", start: "top 60%", once: true },
          });
          cards.forEach((card) => {
            gsap.fromTo(card.querySelector("img"), { yPercent: -6 }, {
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
            });
          });
        }

        /* ---------- Stays: sticky chapters; the one beneath sinks back ---------- */
        const chapters = gsap.utils.toArray<HTMLElement>(".chapter");
        chapters.forEach((chapter, i) => {
          const next = chapters[i + 1];
          if (next && desktop) {
            // As the next resort slides over, this one eases back and dims under a dark veil.
            // (A veil's opacity animates smoothly; animating a CSS brightness filter caused flicker.)
            gsap
              .timeline({ scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true } })
              .fromTo(chapter.querySelector(".chapter__media"), { scale: 1 }, { scale: 0.95, ease: "none" }, 0)
              .fromTo(chapter.querySelector(".chapter__dim"), { opacity: 0 }, { opacity: 0.45, ease: "none" }, 0);
          }
          gsap
            .timeline({ scrollTrigger: { trigger: chapter, start: "top 60%", once: true } })
            .from(chapter.querySelector(".chapter__media img"), { scale: 1.25, duration: 2.4, ease: EASE }, 0)
            .from(chapter.querySelectorAll(".chapter__main > *"), { y: 50, autoAlpha: 0, duration: 1.2, stagger: 0.08, ease: EASE }, 0.15)
            .from(chapter.querySelector(".chapter__ghost"), { xPercent: 15, autoAlpha: 0, duration: 2.2, ease: EASE }, 0);
        });

        /* ---------- Photo wall: columns drift at different speeds ---------- */
        gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((col) => {
          const drift = parseFloat(col.dataset.drift || "10");
          gsap.fromTo(col, { yPercent: -drift / 2 }, {
            yPercent: drift / 2,
            ease: "none",
            scrollTrigger: { trigger: ".moments", start: "top bottom", end: "bottom top", scrub: true },
          });
        });
        gsap.from(".moments__head-inner > *", {
          y: 50,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1.3,
          ease: EASE,
          scrollTrigger: { trigger: ".moments", start: "top 40%", once: true },
        });

        /* ---------- Journal: titles slide in from the side ---------- */
        gsap.utils.toArray<HTMLElement>(".story").forEach((story) => {
          gsap.from(story.querySelectorAll("a > *"), {
            x: -60,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 1.2,
            ease: EASE,
            scrollTrigger: { trigger: story, start: "top 75%", once: true },
          });
        });

        /* ---------- Map: contours sketch in, then the route, then the pins drop ---------- */
        const map = document.querySelector<HTMLElement>("[data-map]");
        if (map) {
          gsap
            .timeline({ scrollTrigger: { trigger: map, start: "top 75%", once: true } })
            .fromTo(map.querySelectorAll(".map__contours path"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.4, stagger: 0.03, ease: "power2.out" })
            .from(map.querySelectorAll(".map__reserve"), { autoAlpha: 0, duration: 1 }, 0.8)
            .fromTo(map.querySelector(".map__route"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 1.2)
            .from(map.querySelectorAll(".map__pin"), { y: -30, autoAlpha: 0, duration: 0.9, stagger: 0.18, ease: "back.out(2)" }, 1.6);
        }

        gsap.from(".footer__giant", {
          yPercent: 40,
          autoAlpha: 0,
          duration: 1.6,
          ease: EASE,
          scrollTrigger: { trigger: ".footer", start: "top 80%", once: true },
        });

        return () => {
          lands?.classList.remove("lands--anim");
          document.querySelector("[data-road]")?.classList.remove("is-live");
        };
      },
    );

    // Journal background follows the story in the middle of the screen (works with or without motion).
    // Created after the pinned sections above it, so its positions include their extra scroll length.
    const journal = document.querySelector<HTMLElement>("[data-journal]");
    if (journal) {
      const bgs = journal.querySelectorAll<HTMLElement>("[data-bg]");
      journal.querySelectorAll<HTMLElement>("[data-story]").forEach((story) => {
        ScrollTrigger.create({
          trigger: story,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (!self.isActive) return;
            bgs.forEach((bg) => bg.classList.toggle("is-active", bg.dataset.bg === story.dataset.story));
            story.parentElement?.querySelectorAll("[data-story]").forEach((s) => s.classList.toggle("is-active", s === story));
          },
        });
      });
    }

    // Measure every trigger in page order, so ones set up early still account for the pinned sections above them.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    // Recalculate positions once web fonts and images have changed the layout. Guarded so a
    // refresh fired after this instance has already unmounted (e.g. React Strict Mode's
    // mount → unmount → mount dance in dev) can't run against reverted ScrollTriggers.
    let cancelled = false;
    const onReady = () => !cancelled && ScrollTrigger.refresh();
    document.fonts?.ready.then(onReady);
    window.addEventListener("load", onReady, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", onReady);
      mm.revert();
    };
  });

  return null;
}
