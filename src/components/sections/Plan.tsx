import Backdrop from "../Backdrop";
import NewsletterForm from "../NewsletterForm";
import { img } from "@/content/images";
import { site } from "@/content/site";

export default function Plan() {
  return (
    <section id="plan" className="plan dark" aria-labelledby="plan-title">
      <Backdrop image={img.planRiversideNight} shade="left" parallax={0.18} />
      <div className="wrap plan__grid">
        <div>
          <h2 id="plan-title" className="h2 plan__title" data-split>
            Not sure where to begin?
          </h2>
          <p className="plan__lede" data-fade>
            Tell us what you would like to see and do, and our team will suggest the right stay and season.
          </p>
          <div className="plan__ctas" data-fade>
            <a href="#plan" className="btn btn--gold">Plan my stay</a>
            <a href="#plan" className="btn btn--line-light">WhatsApp us</a>
          </div>
          <p className="plan__contact">
            {site.phone} · {site.email}
          </p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}
