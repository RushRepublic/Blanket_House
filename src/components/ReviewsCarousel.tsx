"use client";

import { useState } from "react";

type Review = {
  lead: string;
  body: string[];
  rating: number;
  by: string;
  source: string;
};

export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);
  const r = reviews[index];

  const go = (next: number) => setIndex((next + reviews.length) % reviews.length);

  return (
    <div className="review-carousel review-carousel__card">
      <figure className="review" key={index}>
        <span className="review__mark" aria-hidden="true">“</span>

        <div className="review__stars" aria-label={`${r.rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, i) => (
            <svg key={i} viewBox="0 0 20 20" aria-hidden="true" className={i < r.rating ? "is-full" : ""}>
              <path d="M10 1.5l2.6 5.46 5.9.86-4.27 4.26 1 6.02L10 15.1l-5.23 2.9 1-6.02L1.5 7.82l5.9-.86L10 1.5Z" />
            </svg>
          ))}
        </div>

        <blockquote className="review__quote">{r.lead}</blockquote>

        <div className="review__body">
          {r.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <figcaption>
          <span className="review__by">{r.by}</span>
          <span className="review__source">{r.source}</span>
        </figcaption>
      </figure>

      {reviews.length > 1 && (
        <div className="review-carousel__nav">
          <button type="button" className="review-carousel__arrow" onClick={() => go(index - 1)} aria-label="Previous review">
            ←
          </button>
          <div className="review-carousel__dots" role="tablist" aria-label="Choose a review">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Review ${i + 1}`}
                className={`review-carousel__dot${i === index ? " is-active" : ""}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
          <button type="button" className="review-carousel__arrow" onClick={() => go(index + 1)} aria-label="Next review">
            →
          </button>
        </div>
      )}
    </div>
  );
}
