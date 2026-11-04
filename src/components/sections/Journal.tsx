import Image from "next/image";
import { journal } from "@/content/site";

// The background photo changes to match whichever story is in the middle of the screen.
export default function Journal() {
  return (
    <section id="journal" className="journal dark" aria-labelledby="journal-title" data-journal>
      <div className="journal__bg" aria-hidden="true">
        {journal.map((post, i) => (
          <div key={post.title} className={`journal__bg-img ${i === 0 ? "is-active" : ""}`} data-bg={i}>
            <Image src={post.image} alt="" fill placeholder="blur" sizes="100vw" />
          </div>
        ))}
        <div className="journal__shade" />
      </div>

      <div className="wrap journal__list">
        <header className="journal__head">
          <p className="eyebrow eyebrow--gold">Journal</p>
          <h2 id="journal-title" className="h2" data-split>
            Stories from the places we stay
          </h2>
          <a href="#journal" className="text-link text-link--light">Read the Journal</a>
        </header>

        {journal.map((post, i) => (
          <article key={post.title} className="story" data-story={i}>
            <a href="#journal">
              <span className="story__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="eyebrow eyebrow--gold">{post.category}</span>
              <h3 className="story__title">{post.title}</h3>
              <figure className="story__thumb">
                <Image src={post.thumb} alt={post.thumbAlt} fill placeholder="blur" sizes="(max-width: 900px) 80vw, 22vw" />
              </figure>
              <span className="text-link text-link--light">Read the story</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
