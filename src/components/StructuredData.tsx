import { site, stays } from "@/content/site";

// Tells Google this is a hotel group with three hotels. Only confirmed facts go here:
// add street address, phone, geo and star rating once Blanket confirms them.
export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        slogan: "Stay inside the landscape.",
        description: site.tagline,
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { "@id": `${site.url}/#organization` },
        inLanguage: "en-IN",
      },
      ...stays.map((s) => ({
        "@type": "Resort",
        "@id": `${site.url}/stays/${s.slug}#hotel`,
        name: s.name,
        description: s.line,
        image: `${site.url}${s.image.src}`,
        parentOrganization: { "@id": `${site.url}/#organization` },
        address: {
          "@type": "PostalAddress",
          addressLocality: s.location,
          addressRegion: "Kerala",
          addressCountry: "IN",
        },
        amenityFeature: s.highlights.map((h) => ({ "@type": "LocationFeatureSpecification", name: h, value: true })),
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD must be a raw string; the content is our own static data.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
