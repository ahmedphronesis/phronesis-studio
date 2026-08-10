/**
 * Publications — book data for Ahmed Ali's published works.
 *
 * Each book has:
 *   - slug: URL path (e.g. /publications/depth-of-knowledge)
 *   - title: main title
 *   - subtitle: subtitle (after the colon)
 *   - author: author name as it appears on the cover
 *   - description: full blurb (2-3 paragraphs)
 *   - coverFront: path to front cover image
 *   - coverBack: path to back cover image
 *   - isbn: ISBN string
 *   - edition: e.g. "First Edition, 2026"
 *   - pages: page count
 *   - language: "English", "Arabic", or "Bilingual"
 *   - formats: array of available formats
 *   - publisher: publisher name or "Self-published"
 *   - publishYear: year as string
 *   - price: display string (e.g. "$19.99 USD")
 *   - buyUrl: primary purchase link
 *   - buyLabel: button label (e.g. "Buy on Amazon")
 *   - chapters: array of chapter titles
 *   - extras: array of supplementary features
 *   - audience: array of "who this is for" entries
 *   - aboutAuthor: author bio paragraph
 *   - featured: boolean (first/most recent book = true)
 *   - forthcoming: boolean (for announced-but-not-yet-published books)
 */

export type Book = {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  description: string[];
  coverFront: string;
  coverBack: string;
  isbn: string;
  edition: string;
  pages: number;
  language: string;
  formats: string[];
  publisher: string;
  publishYear: string;
  price: string;
  buyUrl: string;
  buyLabel: string;
  chapters: string[];
  extras: string[];
  audience: string[];
  aboutAuthor: string;
  featured: boolean;
  forthcoming: boolean;
};

export const BOOKS: Book[] = [
  {
    slug: "depth-of-knowledge",
    title: "Depth of Knowledge",
    subtitle: "A Practical Guide to Designing Rigorous Questions Without AI",
    author: "Ahmed Mahmoud Saeed Ahmed Ali",
    description: [
      "Teachers are outsourcing the design of rigorous questions to AI tools, and the questions they get back are often misclassified, generic, and disconnected from the actual lesson. This handbook gives teachers back the cognitive skill of designing those questions themselves.",
      "Depth of Knowledge: A Practical Guide to Designing Rigorous Questions Without AI restores to educators the craft of writing cognitively demanding questions from lesson content alone, without relying on artificial intelligence tools. It uses Norman L. Webb's Depth of Knowledge (DOK) framework as its spine, returns to Webb's own 1997 and 2002 monographs as primary sources, and corrects the widespread misinterpretation of DOK perpetuated by the unauthorized \"DOK Wheel\" graphic.",
      "The handbook's core contribution is a five-step, content-first, verb-agnostic protocol that takes any lesson from any subject and any grade level and produces four questions (one at each DOK level) designed from the lesson's own content rather than from a generic stem or a tool's output. The method is verified by reverse-coding, the most reliable test for confirming a question's actual cognitive demand.",
      "The handbook is distinctive in three respects. First, it is faithful to Webb's primary sources rather than to the secondary literature that has distorted them. Second, it provides a practical method that works across subjects, with worked examples in science, philosophy, mathematics, history, English, Arabic, and Islamic Education. Third, it situates the framework within a longer and broader intellectual history: a substantial chapter traces the principle that \"recall is not reasoning\" through the Islamic intellectual tradition, from Al-Hasan al-Basri in the eighth century to Ibn Khaldun's four-level progression in the Muqaddimah (1377) to contemporary thinkers. This genealogy establishes that the underlying principle is neither uniquely Western nor exclusively modern, and positions the handbook for international use and a planned Arabic edition.",
    ],
    coverFront: "/publications/depth-of-knowledge-front.jpg",
    coverBack: "/publications/depth-of-knowledge-back.jpg",
    isbn: "979-8-1913137-5-7",
    edition: "First Edition, 2026",
    pages: 149,
    language: "English",
    formats: ["Paperback"],
    publisher: "Self-published",
    publishYear: "2026",
    price: "$19.99 USD",
    buyUrl: "https://kdp.amazon.com/amazon-dp-action/us/dualbookshelf.marketplacelink/B0HDMK7RGX",
    buyLabel: "Buy on Amazon",
    chapters: [
      "Chapter 1: Foundations (What Is Depth of Knowledge?)",
      "Chapter 2: History (Norman Webb and the Origins of DOK, including the Islamic intellectual tradition)",
      "Chapter 3: The Four DOK Levels Explained",
      "Chapter 4: DOK vs Bloom's Taxonomy (and the Verb Trap)",
      "Chapter 5: Comparing DOK with Other Frameworks (SOLO, Marzano, UbD, UDL)",
      "Chapter 6: Designing DOK Questions Without AI (The Core Method)",
      "Chapter 7: Subject-Specific Applications (9 disciplines)",
      "Chapter 8: Classroom Implementation Without AI",
      "Chapter 9: Assessment Design",
      "Chapter 10: Common Mistakes and How to Avoid Them",
      "Chapter 11: Real-World Applications Beyond School",
      "Chapter 12: Case Studies and Frequently Asked Questions",
    ],
    extras: [
      "Glossary of key terms",
      "Appendix A: 11 printable classroom resources (lesson, unit, and curriculum templates; rubrics; decision tree; reflection tools)",
      "Appendix B: Verb-agnostic DOK question stem library",
      "Full references in APA 7th edition format",
      "Comprehensive index",
    ],
    audience: [
      "K-12 classroom teachers",
      "Instructional coaches and department heads",
      "Curriculum coordinators in American-curriculum and international schools",
      "Schools of education faculty and teacher educators",
      "Professional development providers",
      "Education policymakers concerned with assessment alignment",
      "Anyone skeptical of AI-generated instructional content",
    ],
    aboutAuthor:
      "Ahmed Mahmoud Saeed Ahmed Ali is an Egyptian educator, philosopher, and systems architect based in Abu Dhabi, United Arab Emirates. He holds a Bachelor of Arts in Philosophy from Alexandria University, a Postgraduate Diploma in Education from Al-Azhar University, and a UAE teaching license. His academic background combines classical philosophical training with contemporary educational practice. His professional work spans classroom teaching, curriculum design, and the architecture of educational systems. He is the founder of Studio of Phronesis.",
    featured: true,
    forthcoming: false,
  },
];

export function getBookBySlug(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}

export function getFeaturedBook(): Book | undefined {
  return BOOKS.find((b) => b.featured && !b.forthcoming);
}
