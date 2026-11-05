"use client";

import { useState } from "react";
import Image from "next/image";
import Backdrop from "../Backdrop";
import { journal } from "@/content/site";

const categories = Array.from(new Set(journal.map((post) => post.category)));

export default function Journal() {
  const [active, setActive] = useState("All");
  const shown = active === "All" ? journal : journal.filter((post) => post.category === active);

  return (
    <section id="journal" className="journal dark" aria-labelledby="journal-title">
      <Backdrop image={journal[0].image} alt="" shade="full" parallax={0.15} />

      <div className="wrap journal__inner">
        <header className="journal__head">
          <p className="eyebrow eyebrow--gold">Journal</p>
          <h2 id="journal-title" className="h2" data-split>
            Stories from the places we stay
          </h2>
          <a href="#journal" className="text-link text-link--light">Read the Journal</a>
        </header>

        <div className="journal__filters" role="tablist" aria-label="Filter stories by topic">
          <button
            type="button"
            role="tab"
            aria-selected={active === "All"}
            className={`journal__filter ${active === "All" ? "is-active" : ""}`}
            onClick={() => setActive("All")}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={active === c}
              className={`journal__filter ${active === c ? "is-active" : ""}`}
              onClick={() => setActive(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <ul className="journal__carousel">
          {shown.map((post) => (
            <li key={post.title} className="story-card">
              <a href="#journal">
                <span className="story-card__frame">
                  <Image src={post.thumb} alt={post.thumbAlt} fill sizes="(max-width: 900px) 74vw, 280px" placeholder="blur" />
                </span>
                <span className="story-card__category">{post.category}</span>
                <h3 className="story-card__title">{post.title}</h3>
                <span className="text-link text-link--light">Read the story</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
