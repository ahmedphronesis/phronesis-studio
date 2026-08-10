/**
 * JSON-LD structured data for Studio of Phronesis.
 *
 * This tells Google (and other search engines) exactly what your organization
 * is, its logo, founder, location, and what it does. It's what enables rich
 * search results with your logo next to the search snippet.
 *
 * Reference: https://developers.google.com/search/docs/appearance/structured-data
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://phronesis-studio.com/#organization",
    name: "Studio of Phronesis",
    alternateName: "Phronesis Studio",
    url: "https://phronesis-studio.com",
    logo: "https://phronesis-studio.com/favicon-512x512.png",
    image: "https://phronesis-studio.com/og-image.png",
    description:
      "Perceiving the gap between what is and what should be, and closing it with discipline. Custom software, educational platforms, and operational systems built by a philosopher-educator-architect in Al Ain, UAE.",
    slogan: "Perceiving the gap between what is and what should be, and closing it with discipline.",
    foundingDate: "2024",
    founder: {
      "@type": "Person",
      name: "Ahmed Ali",
      jobTitle: "Philosopher, Educator, Architect",
      url: "https://phronesis-studio.com",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Al Ain",
      addressRegion: "Abu Dhabi",
      addressCountry: "AE",
    },
    areaServed: "United Arab Emirates",
    knowsLanguage: ["en", "ar"],
    sameAs: [
      "https://linkedin.com/in/ahmedmahmoudsaeedahmedali",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "ahmed@phronesis-studio.com",
      areaServed: "Worldwide",
      availableLanguage: ["English", "Arabic"],
    },
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Custom Software Build",
          description:
            "Production-grade custom software platforms for schools, businesses, and institutions.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Educational Consultation",
          description:
            "Curriculum design, operational audit, and structured consultation for educational institutions.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Tutoring",
          description:
            "One-on-one tutoring in philosophy, critical thinking, English, MUN, and foundational computer science.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * WebSite schema — helps Google understand the site structure and enables
 * sitelinks search box (when applicable).
 */
export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://phronesis-studio.com/#website",
    url: "https://phronesis-studio.com",
    name: "Studio of Phronesis",
    description:
      "Perceiving the gap between what is and what should be, and closing it with discipline.",
    publisher: {
      "@id": "https://phronesis-studio.com/#organization",
    },
    inLanguage: ["en", "ar"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Person schema — for the founder (Ahmed Ali). Helps Google show a knowledge
 * panel when someone searches for the name directly.
 */
export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://phronesis-studio.com/#person",
    name: "Ahmed Ali",
    jobTitle: "Philosopher, Educator, Architect",
    url: "https://phronesis-studio.com",
    image: "https://phronesis-studio.com/og-image.png",
    worksFor: {
      "@id": "https://phronesis-studio.com/#organization",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Al Ain",
      addressRegion: "Abu Dhabi",
      addressCountry: "AE",
    },
    knowsAbout: [
      "Philosophy",
      "Education",
      "Software Architecture",
      "Model United Nations",
      "Leadership",
      "Aristotelian Ethics",
      "Phronesis",
    ],
    sameAs: [
      "https://linkedin.com/in/ahmedmahmoudsaeedahmedali",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
