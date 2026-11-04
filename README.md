# Blanket Hotels & Resorts — website

Next.js (React) site with server-side rendering for SEO, GSAP + Lenis scroll animation.

## Run it

```bash
npm install        # first time only
npm run dev        # development, open http://localhost:3000
npm run build      # production build (pre-renders every page as HTML)
npm start          # serve the production build
```

## Where things are

| What | Where |
|---|---|
| All homepage text, resorts, experiences, seasons | `src/content/site.ts` |
| Which photos are used | `src/content/images.ts` and `scripts/prepare-images.mjs` |
| Homepage sections | `src/components/sections/` |
| Scroll animations | `src/components/ScrollEffects.tsx` |
| Colours, fonts, layout | `src/app/globals.css` |
| SEO (title, description, share image) | `src/app/layout.tsx`, `src/components/StructuredData.tsx` |

## Photos

Originals stay in `../Images`. `npm run images` makes web-sized copies (max 2560 px) in
`src/assets/images`; Next.js then serves AVIF/WebP at the right size for each screen.
To use a different photo, change its path in `scripts/prepare-images.mjs`, delete the old
copy in `src/assets/images`, and run `npm run images` again.

## Before launch

- Copy `.env.example` to `.env` and set the real domain.
- Replace every `[bracketed]` placeholder in `src/content/site.ts` and the sections.
- Connect the booking engine in `src/components/BookingBar.tsx`.
