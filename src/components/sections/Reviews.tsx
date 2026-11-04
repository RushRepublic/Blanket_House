import Backdrop from "../Backdrop";
import { img } from "@/content/images";

// Only verified reviews go here (name, city, rating and source). Until then the section shows clear placeholders.
const reviews = [
  { quote: "[Guest review quote, from a verified review source]", by: "[Guest name, city]", source: "[Rating and source]" },
];

export default function Reviews() {
  return (
    <section className="reviews dark" aria-labelledby="reviews-title">
      <Backdrop image={img.reviewsRiversideDusk} shade="full" parallax={0.2} />
      <div className="wrap reviews__inner">
        <h2 id="reviews-title" className="eyebrow eyebrow--gold">In our guests&apos; words</h2>
        {reviews.map((r) => (
          <figure key={r.quote} className="review">
            <blockquote className="review__quote" data-split>
              “{r.quote}”
            </blockquote>
            <figcaption data-fade>
              {r.by} · {r.source}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
