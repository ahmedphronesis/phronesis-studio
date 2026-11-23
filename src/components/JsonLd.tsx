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
      "Perceiving the gap between what is and what should be, and closing it with discipline. Custom software, educational platforms, and operational systems built by a philosopher, author, educator, and systems architect. Founded in Abu Dhabi, UAE, the studio serves clients internationally across education, scholarship, and software.",
    slogan: "Perceiving the gap between what is and what should be, and closing it with discipline.",
    foundingDate: "2024",
    foundingLocation: {
      "@type": "Place",
      name: "Abu Dhabi, United Arab Emirates",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Abu Dhabi",
        addressRegion: "Abu Dhabi",
        addressCountry: "AE",
      },
    },
    founder: {
      "@type": "Person",
      name: "Ahmed Ali",
      jobTitle: "Philosopher, Author, Educator, Systems Architect, Trainer",
      url: "https://phronesis-studio.com",
    },
    areaServed: "Worldwide",
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
    author: {
      "@type": "Person",
      name: "Ahmed Ali",
      url: "https://phronesis-studio.com",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Publications",
      itemListElement: [
        {
          "@type": "Book",
          name: "Depth of Knowledge: A Practical Guide to Designing Rigorous Questions Without AI",
          author: {
            "@type": "Person",
            name: "Ahmed Ali",
          },
          isbn: "979-8-1913137-5-7",
          datePublished: "2026",
          numberOfPages: 149,
          inLanguage: "en",
          url: "https://phronesis-studio.com/en/publications/depth-of-knowledge",
          publisher: {
            "@type": "Organization",
            name: "Independently published",
          },
        },
      ],
    },
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
    alternateName: "Ahmed Mahmoud Saeed Ahmed Ali",
    jobTitle: "Philosopher, Author, Educator, Systems Architect, Trainer",
    url: "https://phronesis-studio.com",
    image: "https://phronesis-studio.com/og-image.png",
    description: "Ahmed Mahmoud Saeed Ahmed Ali is an Egyptian philosopher, author, educator, systems architect, and professional trainer with an international background. Author of 'Depth of Knowledge: A Practical Guide to Designing Rigorous Questions Without AI' (2026, ISBN 979-8-1913137-5-7). Founder of Studio of Phronesis, established in Abu Dhabi, UAE. Member of the British Philosophical Association (BPA). He delivers on-site teacher training and professional development internationally and works across education, scholarship, and software.",
    worksFor: {
      "@id": "https://phronesis-studio.com/#organization",
    },
    knowsAbout: [
      "Philosophy",
      "Education",
      "Software Architecture",
      "Model United Nations",
      "Leadership",
      "Aristotelian Ethics",
      "Phronesis",
      "Depth of Knowledge",
      "Norman Webb DOK",
      "Islamic Philosophy",
      "Ibn Khaldun",
      "Teacher Training",
      "Professional Development",
      "Curriculum Design",
      "Educational Consulting",
    ],
    occupation: "Author, Educator, and Trainer",
    authorOf: [
      {
        "@type": "Book",
        name: "Depth of Knowledge: A Practical Guide to Designing Rigorous Questions Without AI",
        isbn: "979-8-1913137-5-7",
        datePublished: "2026",
        numberOfPages: 149,
        inLanguage: "en",
        url: "https://phronesis-studio.com/en/publications/depth-of-knowledge",
      },
    ],
    sameAs: [
      "https://linkedin.com/in/ahmedmahmoudsaeedahmedali",
      "https://www.amazon.com/author/ahmed-ali",
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
 * Review JSON-LD — schema.org/Review structured data for the scholarly
 * endorsement of "Depth of Knowledge" by Dr. Frank Höselbarth.
 *
 * This enables Google to display a rich snippet (review snippet with the
 * author and a quote excerpt) when someone searches for the book, the
 * author's name, or related queries.
 *
 * Reference: https://developers.google.com/search/docs/appearance/structured-data/review-snippet
 */
export function EndorsementJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Book",
      "name": "Depth of Knowledge: A Practical Guide to Designing Rigorous Questions Without AI",
      "author": {
        "@type": "Person",
        "name": "Ahmed Mahmoud Saeed Ahmed Ali",
      },
      "isbn": "979-8-1913137-5-7",
      "datePublished": "2026",
      "numberOfPages": 149,
      "inLanguage": "en",
      "publisher": {
        "@type": "Organization",
        "name": "Independently published",
      },
      "url": "https://phronesis-studio.com/en/publications/depth-of-knowledge",
    },
    "reviewBody": "The very subtitle of the book serves as a salutary provocation in an age when the capacity for independent thought is in danger of being lost. The author — an Egyptian philosopher and experienced educator in the UAE — cannot be praised highly enough for this ingenious choice of title alone. Ali aims for a philosophical approach he articulated in the Studio of Phronesis: perceiving the gap between what is and what should be, and closing it with discipline. Drawing on the DOK framework developed by Norman L. Webb in 1997, Ahmed Ali uses this methodological framework to distinguish four levels of knowledge. The hierarchization of knowledge into four ascending stages did not originate with James Webb; classical Islamic pedagogy, including Ibn Khaldun's Muqaddimah (1377), had already anticipated the DOK structures.",
    "datePublished": "2026-11",
    "inLanguage": "en",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5",
      "bestRating": "5",
      "worstRating": "1",
    },
    "author": {
      "@type": "Person",
      "name": "Dr. Frank Höselbarth",
      "jobTitle": "Philosopher",
      "description": "Author of 'The Education Revolution in the Gulf and the German Industry' (2026). Founder of Nxtgn-Academic-Industrial-Cooperations Ltd., Abu Dhabi.",
      "url": "https://phronesis-studio.com/en/publications/depth-of-knowledge",
    },
    "publisher": {
      "@type": "Organization",
      "name": "people+brand agency",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Thurn-und-Taxis-Platz 6",
        "postalCode": "60313",
        "addressLocality": "Frankfurt am Main",
        "addressCountry": "DE",
      },
    },
    "url": "https://phronesis-studio.com/endorsements/Endorsement_Hoselbarth_2026.pdf",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
