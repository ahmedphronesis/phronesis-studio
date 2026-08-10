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

export type Book = {
  // ─── Language-neutral fields ────────────────────────────────────────────
  slug: string;
  coverFront: string;
  coverBack: string;
  isbn: string;
  pages: number;
  publishYear: string;
  price: string;
  buyUrl: string;
  featured: boolean;
  forthcoming: boolean;

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
    price: "$19.99 USD",
    buyUrl: "https://kdp.amazon.com/amazon-dp-action/us/dualbookshelf.marketplacelink/B0HDMK7RGX",
    featured: true,
    forthcoming: false,

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
      "Ahmed Mahmoud Saeed Ahmed Ali is an Egyptian educator, philosopher, and systems architect based in Abu Dhabi, United Arab Emirates. He holds a Bachelor of Arts in Philosophy from Alexandria University, a Postgraduate Diploma in Education from Al-Azhar University, and a UAE teaching license. His academic background combines classical philosophical training with contemporary educational practice. His professional work spans classroom teaching, curriculum design, and the architecture of educational systems. He is the founder of Studio of Phronesis.",

    // ─── Arabic ───────────────────────────────────────────────────────────
    titleAr: "عمق المعرفة",
    subtitleAr: "دليلٌ عمليٌّ لتصميم الأسئلة الصارمة دون الذكاء الاصطناعي",
    authorAr: "أحمد محمود سعيد أحمد علي",
    descriptionAr: [
      "أصبح المعلمون يُؤْتون تصميمَ الأسئلة الصارمة لأدواتِ الذكاء الاصطناعي، والأسئلةُ التي تعود بها هذه الأدواتُ كثيرًا ما تكونُ مُصنَّفةً خطأً، عامّةً، ومنفصلةً عن الدرس الفعلي. يُعيدُ هذا الدليلِ إلى المعلمين مهارةَ تصميم تلك الأسئلة بأنفسهم.",
      "يستعيدُ كتابُ «عمق المعرفة: دليلٌ عمليٌّ لتصميم الأسئلة الصارمة دون الذكاء الاصطناعي» صناعةَ كتابةِ الأسئلة ذات المطالب المعرفية العالية من محتوى الدرس وحده، دون الاعتماد على أدوات الذكاء الاصطناعي. يتَّخذُ الكتابُ من إطار نورمان ل. ويب لعمق المعرفة (DOK) عمودًا فقريًّا، ويعودُ إلى كتيَّبَي ويب الأصليَّين لعامَي 1997 و2002 بوصفهما مصدرَين أوليَّين، ويُصحِّحُ التأويلَ الخاطئ المنتشرَ لعمق المعرفة والذي روّجتْه صورةُ «عجلة عمق المعرفة» غير المُصرَّح بها.",
      "أسهمُ الكتابِ المحوريُّ هو بروتوكولٌ من خمس خطوات، يضعُ المحتوى أولًا ولا يعتدُّ بالأفعال، يأخذُ أيَّ درسٍ من أيِّ مادةٍ وفي أيِّ صفٍّ، فيُنتجُ أربعةَ أسئلةٍ (واحدٍ عند كلِّ مستوى من مستويات عمق المعرفة) مصمَّمةً من محتوى الدرس نفسه لا من قوالبَ عامّةٍ أو من مُخرجات الأدوات. ويُتحقَّقُ من الطريقةِ بالترميز العكسي، وهو الأمضى اختبارًا لتأكيد المطالب المعرفية الفعلية للسؤال.",
      "يتميَّزُ الكتابُ بثلاث خصائص: أولًا، أنه أمينٌ لمصادر ويب الأولية لا للأدبيات الثانوية التي شوَّهتْها. ثانيًا، أنه يقدِّمُ طريقةً عمليةً تعملُ عبر المواد، بأمثلةٍ محلولةٍ في العلوم والفلسفة والرياضيات والتاريخ والإنجليزية والعربية والتربية الإسلامية. ثالثًا، أنه يُضمِرُ الإطارَ ضمن تاريخٍ فكريٍّ أطولَ وأوسع: فصلٌ موسَّعٌ يتتبَّعُ مبدأَ «الاستدعاء ليس استدلالًا» في التراث الفكري الإسلامي، من الحسن البصري في القرن الثامن إلى التدرُّج الرباعي لابن خلدون في المقدمة (1377م) إلى مفكِّرين معاصرين. يُثبتُ هذا النسبُ أن المبدأ الأساسيَّ ليس غربيًّا خالصًا ولا حديثًا فحسب، ويُهيِّئُ الكتابَ للاستخدام الدولي ولإصدارٍ عربيٍّ مخطَّط.",
    ],
    editionAr: "الطبعة الأولى، 2026",
    languageAr: "الإنجليزية",
    formatsAr: ["غلاف ورقي"],
    publisherAr: "إصدار ذاتي",
    buyLabelAr: "الشراء من أمازون",
    chaptersAr: [
      "الفصل الأول: الأسس (ما عمق المعرفة؟)",
      "الفصل الثاني: التاريخ (نورمان ويب وأصول عمق المعرفة، بما في ذلك التراث الفكري الإسلامي)",
      "الفصل الثالث: شرح مستويات عمق المعرفة الأربعة",
      "الفصل الرابع: عمق المعرفة مقابل تصنيف بلوم (وفخُّ الأفعال)",
      "الفصل الخامس: مقارنة عمق المعرفة بأطر العمل الأخرى (SOLO، مارانو، UbD، UDL)",
      "الفصل السادس: تصميم أسئلة عمق المعرفة دون الذكاء الاصطناعي (الطريقة المحورية)",
      "الفصل السابع: تطبيقاتٌ متخصصةٌ في المواد (9 تخصصات)",
      "الفصل الثامن: التطبيق الصفيّ دون الذكاء الاصطناعي",
      "الفصل التاسع: تصميم التقييم",
      "الفصل العاشر: الأخطاء الشائعة وكيفية تجنُّبها",
      "الفصل الحادي عشر: تطبيقاتٌ واقعيةٌ خارج المدرسة",
      "الفصل الثاني عشر: دراسات حالة وأسئلة متكررة",
    ],
    extrasAr: [
      "مسردٌ بالمصطلحات الأساسية",
      "الملحق أ: 11 مصدرًا صفِّيًّا قابلًا للطباعة (قوالب دروس ووحدات ومناهج؛ روبركس؛ شجرة قرار؛ أدوات تأمل)",
      "الملحق ب: مكتبةُ أسئلة عمق المعرفة لا تعتدُّ بالأفعال",
      "مراجعُ كاملةٌ بصيغة APA الإصدار السابع",
      "فهرسٌ شامل",
    ],
    audienceAr: [
      "معلمو الصفوف من الأول إلى الثاني عشر",
      "المدرِّبون التربويون ورؤساء الأقسام",
      "منسِّقو المناهج في المدارس الأمريكية والدولية",
      "أعضاء هيئات التدريس في كليات التربية ومُعدُّو المعلمين",
      "مقدِّمو التدريب المهني المستمر",
      "صانعو السياسات التعليمية المعنيُّون بمحاذاة التقييم",
      "كلُّ من يشكُّ في المحتوى التعليمي المُولَّد بالذكاء الاصطناعي",
    ],
    aboutAuthorAr:
      "أحمد محمود سعيد أحمد علي: مربٍّ وفيلسوفٌ وباني نظُم مصريٌّ مقيمٌ في أبوظبي بدولة الإمارات العربية المتحدة. حاصلٌ على بكالوريوس الآداب في الفلسفة من جامعة الإسكندرية، وشهادة الدبلوم في التربية من جامعة الأزهر، ورخصة تدريس إماراتية. يجمع تكوينه الأكاديميُّ بين التدريب الفلسفي الكلاسيكي والممارسة التربوية المعاصرة. يمتدُّ عمله المهنيُّ عبر التدريس الصفّي وتصميم المناهج وهندسة الأنظمة التعليمية. وهو مؤسِّسُ ستوديو فرونسيس.",
  },
];

export function getBookBySlug(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}

export function getFeaturedBook(): Book | undefined {
  return BOOKS.find((b) => b.featured && !b.forthcoming);
}
