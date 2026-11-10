"use client";

import { useState, type FormEvent } from "react";
import { stays } from "@/content/site";

export default function BookingBar() {
  const [message, setMessage] = useState("");

  // TODO: hand the search to the booking engine once Blanket confirms which one it uses.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!data.get("checkin") || !data.get("checkout")) {
      setMessage("Choose your check-in and check-out dates to see availability.");
      return;
    }
    setMessage("Thank you. Live availability will appear here once the booking engine is connected.");
  };

  return (
    <form id="book" className="booking" onSubmit={onSubmit} aria-label="Check availability">
      <label className="booking__field booking__field--where">
        <span>Where</span>
        <select name="stay" defaultValue="all">
          <option value="all">All Blanket stays</option>
          {stays.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.short}, {s.location}
            </option>
          ))}
        </select>
      </label>
      <label className="booking__field">
        <span>Check-in</span>
        <input type="date" name="checkin" />
      </label>
      <label className="booking__field">
        <span>Check-out</span>
        <input type="date" name="checkout" />
      </label>
      <label className="booking__field">
        <span>Guests</span>
        <select name="guests" defaultValue="2a">
          <option value="2a">2 adults</option>
          <option value="2a1c">2 adults, 1 child</option>
          <option value="group">Family or group</option>
        </select>
      </label>
      <button type="submit" className="btn btn--gold booking__submit">
        Check availability
      </button>
      {message && (
        <p className="booking__note" aria-live="polite">
          {message}
        </p>
      )}
    </form>
  );
}
