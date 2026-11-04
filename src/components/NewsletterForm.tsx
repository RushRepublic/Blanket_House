"use client";

import { useState, type FormEvent } from "react";

export default function NewsletterForm() {
  const [done, setDone] = useState(false);

  // TODO: connect to the mailing list provider.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <form className="newsletter" onSubmit={onSubmit}>
      <label htmlFor="newsletter-email">Seasonal stories and offers, once a month</label>
      <div className="newsletter__row">
        <input id="newsletter-email" name="email" type="email" required placeholder="Your email" autoComplete="email" />
        <button type="submit" className="newsletter__btn">
          Subscribe
        </button>
      </div>
      <p className="newsletter__msg" aria-live="polite">
        {done ? "Thank you. Your first letter arrives with the next season." : ""}
      </p>
    </form>
  );
}
