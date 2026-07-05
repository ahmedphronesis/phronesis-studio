/**
 * Library subject definitions.
 *
 * Each subject has:
 *   - slug: URL path (e.g. /library/mathematics)
 *   - key: i18n key prefix (e.g. "subjectMath")
 *   - live: whether the subject has published guides
 *
 * Subjects are listed in alphabetical order by their English name.
 * Philosophy is NOT included here because it has its own section
 * (the Philosophy tab in the navigation, which routes to /echoes).
 *
 * When adding a new subject:
 *   1. Add it to SUBJECTS below (in alphabetical order)
 *   2. Add i18n keys: subject<Key>, subject<Key>Desc in en.json and ar.json
 *   3. The /library/[subject] route will automatically render a page for it
 */

export type Subject = {
  slug: string;
  key: string;        // i18n key prefix, e.g. "subjectMath"
  live: boolean;
};

// Sorted alphabetically by English subject name.
// Order: Agricultural Sciences, Economics and Political Science, History,
//        Literature and Languages, Mathematics, Natural Sciences,
//        Permaculture, Psychology, Theology
export const SUBJECTS: Subject[] = [
  { slug: "agricultural-sciences", key: "subjectAgriculture", live: false },
  { slug: "economics-and-political-science", key: "subjectEconomics", live: false },
  { slug: "history", key: "subjectHistory", live: false },
  { slug: "literature-and-languages", key: "subjectLiterature", live: false },
  { slug: "mathematics", key: "subjectMath", live: true },
  { slug: "natural-sciences", key: "subjectScience", live: false },
  { slug: "permaculture", key: "subjectPermaculture", live: false },
  { slug: "psychology", key: "subjectPsychology", live: false },
  { slug: "theology", key: "subjectTheology", live: false },
];

// Mathematics guides (the only live subject with content for now)
export type Guide = {
  grade: string;
  gradeArabic: string;
  cover: string;
  pdf: string;
  pages: number;
  units: number;
  modules: number;
  highlight: string;
};

export const MATH_GUIDES: Guide[] = [
  { grade: "Grade 1", gradeArabic: "الصف الأول", cover: "/guides/grade-1-mathematics-cover.png", pdf: "/guides/grade-1-mathematics.pdf", pages: 21, units: 6, modules: 18, highlight: "Foundations" },
  { grade: "Grade 2", gradeArabic: "الصف الثاني", cover: "/guides/grade-2-mathematics-cover.png", pdf: "/guides/grade-2-mathematics.pdf", pages: 21, units: 7, modules: 22, highlight: "Real-Life Connections" },
  { grade: "Grade 3", gradeArabic: "الصف الثالث", cover: "/guides/grade-3-mathematics-cover.png", pdf: "/guides/grade-3-mathematics.pdf", pages: 27, units: 6, modules: 20, highlight: "Real-Life Applications" },
  { grade: "Grade 4", gradeArabic: "الصف الرابع", cover: "/guides/grade-4-mathematics-cover.png", pdf: "/guides/grade-4-mathematics.pdf", pages: 31, units: 7, modules: 21, highlight: "Real-Life Applications" },
];

export function getSubjectBySlug(slug: string): Subject | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}
