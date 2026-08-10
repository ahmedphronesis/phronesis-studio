/**
 * Publications — book data for Ahmed Ali's published works.
 *
 * Each book has bilingual fields (en* and ar*) for every piece of content
 * that is language-specific. Language-neutral fields (slug, isbn, pages,
 * coverFront, coverBack, buyUrl, price, publishYear, featured, forthcoming)
 * are shared.
 *
 * When rendering, the page picks the field matching the current locale.
 */

export type BookEdition = {
  format: string;        // "Paperback", "eBook", "Hardcover"
  formatAr: string;
  price: string;         // "$19.99 USD"
  buyUrl: string;        // purchase URL
  buyLabel: string;      // "Buy on Amazon"
  buyLabelAr: string;
  available: boolean;
};

export type Book = {
  // ─── Language-neutral fields ────────────────────────────────────────────
  slug: string;
  coverFront: string;
  coverBack: string;
  isbn: string;
  pages: number;
  publishYear: string;
  featured: boolean;
  forthcoming: boolean;

  // ─── Editions (multiple formats with individual prices + buy links) ────
  editions: BookEdition[];

  // ─── English fields ─────────────────────────────────────────────────────
  title: string;
  subtitle: string;
  author: string;
  description: string[];
  edition: string;
  language: string;
  formats: string[];
  publisher: string;
  buyLabel: string;
  chapters: string[];
  extras: string[];
  audience: string[];
  aboutAuthor: string;

  // ─── Arabic fields ──────────────────────────────────────────────────────
  titleAr: string;
  subtitleAr: string;
  authorAr: string;
  descriptionAr: string[];
  editionAr: string;
  languageAr: string;
  formatsAr: string[];
  publisherAr: string;
  buyLabelAr: string;
  chaptersAr: string[];
  extrasAr: string[];
  audienceAr: string[];
  aboutAuthorAr: string;
};

export const BOOKS: Book[] = [
  {
    slug: "depth-of-knowledge",
    coverFront: "/publications/depth-of-knowledge-front.jpg",
    coverBack: "/publications/depth-of-knowledge-back.jpg",
    isbn: "979-8-1913137-5-7",
    pages: 149,
    publishYear: "2026",
    featured: true,
    forthcoming: false,

    editions: [
      {
        format: "Paperback",
        formatAr: "غلاف ورقي",
        price: "$19.99 USD",
        buyUrl: "https://kdp.amazon.com/amazon-dp-action/us/dualbookshelf.marketplacelink/B0HDMK7RGX",
        buyLabel: "Buy on Amazon",
        buyLabelAr: "الشراء من أمازون",
        available: true,
      },
      {
        format: "eBook",
        formatAr: "كتاب إلكتروني",
        price: "$9.99 USD",
        buyUrl: "https://kdp.amazon.com/amazon-dp-action/us/dualbookshelf.marketplacelink/B0HDMK7RGX",
        buyLabel: "Buy on Amazon",
        buyLabelAr: "الشراء من أمازون",
        available: true,
      },
    ],

    // ─── English ──────────────────────────────────────────────────────────
    title: "Depth of Knowledge",
    subtitle: "A Practical Guide to Designing Rigorous Questions Without AI",
    author: "Ahmed Mahmoud Saeed Ahmed Ali",
    description: [
      "Teachers are outsourcing the design of rigorous questions to AI tools, and the questions they get back are often misclassified, generic, and disconnected from the actual lesson. This handbook gives teachers back the cognitive skill of designing those questions themselves.",
      "Depth of Knowledge: A Practical Guide to Designing Rigorous Questions Without AI restores to educators the craft of writing cognitively demanding questions from lesson content alone, without relying on artificial intelligence tools. It uses Norman L. Webb's Depth of Knowledge (DOK) framework as its spine, returns to Webb's own 1997 and 2002 monographs as primary sources, and corrects the widespread misinterpretation of DOK perpetuated by the unauthorized \"DOK Wheel\" graphic.",
      "The handbook's core contribution is a five-step, content-first, verb-agnostic protocol that takes any lesson from any subject and any grade level and produces four questions (one at each DOK level) designed from the lesson's own content rather than from a generic stem or a tool's output. The method is verified by reverse-coding, the most reliable test for confirming a question's actual cognitive demand.",
      "The handbook is distinctive in three respects. First, it is faithful to Webb's primary sources rather than to the secondary literature that has distorted them. Second, it provides a practical method that works across subjects, with worked examples in science, philosophy, mathematics, history, English, Arabic, and Islamic Education. Third, it situates the framework within a longer and broader intellectual history: a substantial chapter traces the principle that \"recall is not reasoning\" through the Islamic intellectual tradition, from Al-Hasan al-Basri in the eighth century to Ibn Khaldun's four-level progression in the Muqaddimah (1377) to contemporary thinkers. This genealogy establishes that the underlying principle is neither uniquely Western nor exclusively modern, and positions the handbook for international use and a planned Arabic edition.",
    ],
    edition: "First Edition, 2026",
    language: "English",
    formats: ["Paperback"],
    publisher: "Self-published",
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
      "Ahmed Mahmoud Saeed Ahmed Ali is an Egyptian educator, philosopher, author, and systems architect based in Abu Dhabi, United Arab Emirates. He holds a Bachelor of Arts in Philosophy from Alexandria University, a Postgraduate Diploma in Education from Al-Azhar University, and a UAE teaching license. His academic background combines classical philosophical training with contemporary educational practice. His professional work spans classroom teaching, curriculum design, and the architecture of educational systems. He is the author of \"Depth of Knowledge: A Practical Guide to Designing Rigorous Questions Without AI\" and the founder of Studio of Phronesis.",

    // ─── Arabic ───────────────────────────────────────────────────────────
    titleAr: "العمق المعرفي",
    subtitleAr: "دليل عملي لتصميم أسئلة تُعمّق التفكير بلا ذكاء اصطناعي",
    authorAr: "أحمد محمود سعيد أحمد علي",
    descriptionAr: [
      "أضحى كثيرٌ من المعلمين يُوكِلون تصميم الأسئلة ذات المطالب المعرفية العالية إلى أدوات الذكاء الاصطناعي، غير أن الأسئلةَ التي تُخرجها هذه الأدواتُ غالبًا ما تكونُ مُصنَّفةً على غير هدًى، وغامضةَ المضمون، بعيدةً عن مادّة الدرس الفعليّة. يُعيدُ هذا الكتابِ إلى المعلمينُ مهارةَ تصميم تلك الأسئلة بأنفسهم.",
      "يستعيدُ كتاب «العمق المعرفي: دليل عملي لتصميم أسئلة تُعمّق التفكير بلا ذكاء اصطناعي» صناعةَ كتابةِ الأسئلةِ ذاتِ المطالب المعرفية العالية من مادّة الدرس وحدها، دون الاعتماد على أدوات الذكاء الاصطناعي. يرتكزُ الكتابُ على إطار العمق المعرفي (DOK) الذي وضعَه نورمان ويب (Norman Webb)، ويعودُ إلى كتيّبَي ويب الأصليَّين لعامَي 1997 و2002 بوصفهما مصدرَين أوليَّين، ويُصحِّحُ التأويلَ الخاطئ المنتشرَ للإطار والذي روّجتْه صورةُ «عجلة العمق المعرفي» غير المُعتمَدة.",
      "يتمحورُ الإسهامُ الجوهريُّ للكتابِ حول بروتوكولٍ عمليٍّ من خمس خطوات، يُعطي الأولويّةَ للمحتوى ويستقلُّ عن قوائم الأفعال؛ فهو يأخذُ أيَّ درسٍ من أيِّ مادةٍ وفي أيِّ صفٍّ، فيُخرجُ أربعةَ أسئلةٍ — واحدًا عند كلِّ مستوى من مستويات العمق المعرفي — مُشَكَّلةً من مادّة الدرس نفسه لا من قوالبَ جاهزةٍ أو مخرجاتٍ آليّة. وتُختبرُ الطريقةُ بالترميز العكسي، وهو أنضجُ وسائل التحقُّق من المطالب المعرفية الفعليّة للسؤال.",
      "ويتميَّزُ الكتابُ بثلاثِ خصائصَ جوهريّة: أوّلُها الأمانُ للمصادر الأوليّة لويب، لا للأدبيّات الثانويّة التي شوّهتْها. وثانيها أنّه يُقدِّمُ منهجًا عمليًّا يصلحُ للتطبيقِ عبر الموادِّ كافّةً، بأمثلةٍ محلولةٍ في العلوم والفلسفة والرياضيّات والتاريخ واللغة الإنجليزيّة واللغة العربيّة والتربية الإسلاميّة. وثالثُها أنّه يُؤطِّرُ الإطارَ داخل تاريخٍ فكريٍّ أطولَ وأوسع: فقد خُصِّصَ فصلٌ موسَّعٌ لتتبُّع مبدأِ «الاستدعاء ليس استدلالًا» في التراث الفكري الإسلامي، من الحسن البصري في القرن الثامن، إلى التدرُّج الرباعي عند ابن خلدون في «المقدّمة» (1377م)، وصولًا إلى مفكِّرين معاصرين. يُثبتُ هذا النسبُ أنّ المبدأَ الجوهريَّ ليس غربيًّا خالصًا ولا حديثًا فحسب، ويُهيِّئُ الكتابَ للاستخدام الدوليّ ولإصدارٍ عربيٍّ مخطَّط.",
    ],
    editionAr: "الطبعة الأولى، 2026",
    languageAr: "الإنجليزية",
    formatsAr: ["غلاف ورقي"],
    publisherAr: "إصدار ذاتي",
    buyLabelAr: "الشراء من أمازون",
    chaptersAr: [
      "الفصل الأول: الأسس (ما العمق المعرفي؟)",
      "الفصل الثاني: التاريخ (نورمان ويب (Norman Webb) وأصول العمق المعرفي، بما في ذلك التراث الفكري الإسلامي)",
      "الفصل الثالث: شرح مستويات العمق المعرفي الأربعة",
      "الفصل الرابع: العمق المعرفي مقابل تصنيف بلوم (وفخّ الأفعال)",
      "الفصل الخامس: مقارنة العمق المعرفي بأطر العمل الأخرى (SOLO، مارانو، UbD، UDL)",
      "الفصل السادس: تصميم أسئلة العمق المعرفي بلا ذكاء اصطناعي (المنهج الجوهري)",
      "الفصل السابع: تطبيقات متخصصة في المواد (9 تخصصات)",
      "الفصل الثامن: التطبيق الصفّي بلا ذكاء اصطناعي",
      "الفصل التاسع: تصميم التقييم",
      "الفصل العاشر: الأخطاء الشائعة وكيفية تجنّبها",
      "الفصل الحادي عشر: تطبيقات واقعية خارج المدرسة",
      "الفصل الثاني عشر: دراسات حالة وأسئلة متكررة",
    ],
    extrasAr: [
      "مسرد بالمصطلحات الأساسية",
      "الملحق أ: 11 مصدرًا صفّيًّا قابلًا للطباعة (قوالب للدروس والوحدات والمناهج؛ روبركس؛ شجرة قرار؛ أدوات تأمل)",
      "الملحق ب: مكتبة أسئلة العمق المعرفي المستقلة عن الأفعال",
      "مراجع كاملة بصيغة APA الإصدار السابع",
      "فهرس شامل",
    ],
    audienceAr: [
      "معلمو الصفوف من الأول إلى الثاني عشر",
      "المدرّبون التربويّون ورؤساء الأقسام",
      "منسّقو المناهج في المدارس الأمريكية والدولية",
      "أعضاء هيئات التدريس في كليّات التربية ومُعدّو المعلمين",
      "مقدّمو التدريب المهنيّ المستمر",
      "صانعو السياسات التعليمية المعنيّون بمحاذاة التقييم",
      "كلّ من يشكّ في المحتوى التعليميّ المُولَّد بالذكاء الاصطناعي",
    ],
    aboutAuthorAr:
      "أحمد محمود سعيد أحمد علي: مربٍّ وفيلسوفٌ ومؤلِّفٌ وباني نظُمٍ مصريٌّ مقيمٌ في أبوظبي بدولة الإمارات العربية المتحدة. حاصلٌ على بكالوريوس الآداب في الفلسفة من جامعة الإسكندرية، وشهادة الدبلوم في التربية من جامعة الأزهر، ورخصة تدريس إماراتية. يجمع تكوينه الأكاديميّ بين التدريب الفلسفي الكلاسيكي والممارسة التربويّة المعاصرة. يمتدّ عمله المهنيّ عبر التدريس الصفّي وتصميم المناهج وهندسة الأنظمة التعليميّة. وهو مؤلِّفُ كتاب «العمق المعرفي: دليل عملي لتصميم أسئلة تُعمّق التفكير بلا ذكاء اصطناعي»، ومؤسِّسُ ستوديو فرونسيس.",
  },
];

export function getBookBySlug(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}

export function getFeaturedBook(): Book | undefined {
  return BOOKS.find((b) => b.featured && !b.forthcoming);
}
