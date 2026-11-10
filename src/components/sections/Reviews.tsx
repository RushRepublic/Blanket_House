import Backdrop from "../Backdrop";
import ReviewsCarousel from "../ReviewsCarousel";
import { img } from "@/content/images";

// Only verified reviews go here (name, city, rating and source). Until the guest's name/city and
// the review's source are confirmed, those two fields stay as clear placeholders.
const reviews = [
  {
    lead: "Fantastic experience at this hotel.",
    body: [
      "The scenery is just stunning and we loved eating at the cafe in front of incredible views!",
      "Note there is no alcohol there, but was honestly great to detox after partying in Delhi and Jaipur.",
      "The service was also super attentive and helpful. Would recommend to anyone looking to visit Kerala!",
    ],
    rating: 5,
    by: "[Guest name, city]",
    source: "[Source]",
  },
  {
    lead: "Overall, a very pleasant and memorable stay.",
    body: [
      "A well-deserved 5/5 rating! Highly recommended for anyone looking for a relaxing luxury getaway in Munnar.",
    ],
    rating: 5,
    by: "[Guest name, city]",
    source: "[Source]",
  },
];

export default function Reviews() {
  return (
    <section className="reviews dark" aria-labelledby="reviews-title">
      <Backdrop image={img.reviewsRiversideDusk} shade="full" parallax={0.2} />
      <div className="wrap reviews__inner">
        <h2 id="reviews-title" className="eyebrow eyebrow--gold">In our guests&apos; words</h2>
        <ReviewsCarousel reviews={reviews} />
      </div>
    </section>
  );
}
