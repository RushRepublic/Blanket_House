"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { monthNames, seasons } from "@/content/site";

const seasonFor = (month: number) => seasons.find((s) => s.months.includes(month)) ?? seasons[0];

export default function SeasonGuide() {
  // Start on the build month so server and browser render the same HTML, then move to today's month.
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  useEffect(() => setMonth(new Date().getMonth() + 1), []);

  const season = seasonFor(month);

  return (
    <div className="seasons">
      <div className="seasons__media" aria-hidden="true">
        {seasons.map((s) => (
          <Image
            key={s.id}
            src={s.image}
            alt=""
            fill
            sizes="100vw"
            placeholder="blur"
            className={s.id === season.id ? "is-active" : ""}
          />
        ))}
      </div>

      <div className="seasons__body">
        <div className="months" role="tablist" aria-label="Choose a month">
          {monthNames.map((name, i) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={month === i + 1}
              aria-controls="season-panel"
              className="months__tab"
              onClick={() => setMonth(i + 1)}
            >
              {name}
            </button>
          ))}
        </div>

        <div id="season-panel" role="tabpanel" className="seasons__panel" key={season.id}>
          <div className="seasons__lead">
            <p className="eyebrow eyebrow--light">{monthNames[month - 1]} · {season.name}</p>
            <h3 className="seasons__title">This month in the hills</h3>
            <p>{season.summary}</p>
          </div>
          <div className="seasons__places">
            <div>
              <p className="eyebrow eyebrow--light">Thekkady</p>
              <p>{season.thekkady}</p>
              <a href="#stays" className="text-link text-link--light">Stay at Blanket Days</a>
            </div>
            <div>
              <p className="eyebrow eyebrow--light">Munnar</p>
              <p>{season.munnar}</p>
              <a href="#stays" className="text-link text-link--light">Stay at Blanket Riverside</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
