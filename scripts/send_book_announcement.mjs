// Send the "Depth of Knowledge" book publication announcement to ALL
// existing subscribers. Each subscriber receives the email in the locale
// they subscribed with (EN or AR).
//
// This is a ONE-TIME script — run it once to notify existing subscribers
// who joined before the book was published. New subscribers going forward
// will learn about the book via the welcome email's Publications entry.
//
// Usage:
//   node send_book_announcement.mjs
//
// Prerequisites:
//   - BREVO_API_KEY (or SMTP_* fallback) must be set in env
//   - The script runs from the project root so it can import email.ts

import { sendBookAnnouncement } from "../src/lib/email.ts";

async function main() {
  console.log("=== Sending book announcement to all existing subscribers ===\n");

  const result = await sendBookAnnouncement({
    bookTitle: "Depth of Knowledge",
    bookSubtitle: "A Practical Guide to Designing Rigorous Questions Without AI",
    bookTitleAr: "العمق المعرفي",
    bookSubtitleAr: "دليل عملي لتصميم أسئلة تُعمّق التفكير بلا ذكاء اصطناعي",
    bookCover: "/publications/depth-of-knowledge-front.jpg",
    bookUrl: "https://phronesis-studio.com/en/publications/depth-of-knowledge",
    buyUrl: "https://kdp.amazon.com/amazon-dp-action/us/dualbookshelf.marketplacelink/B0HDMK7RGX",
    buyLabel: "Buy on Amazon",
    buyLabelAr: "الشراء من أمازون",
    price: "$19.99 USD",
    excerpt: "A handbook that restores to educators the craft of writing cognitively demanding questions from lesson content alone, without relying on AI tools. Built on Norman Webb's Depth of Knowledge framework, with worked examples across seven subjects and a chapter tracing the principle through the Islamic intellectual tradition.",
    excerptAr: "كتابٌ يُعيد إلى المعلمين صناعةَ كتابة الأسئلة ذات المطالب المعرفية العالية من مادّة الدرس وحدها، دون الاعتماد على أدوات الذكاء الاصطناعي. مبنيٌّ على إطار العمق المعرفي (DOK) لنورمان ويب (Norman Webb)، بأمثلةٍ محلولةٍ في سبع مواد، وفصلٍ يتتبّع المبدأ في التراث الفكري الإسلامي.",
  });

  console.log("\n=== Announcement complete ===");
  console.log(`Sent:     ${result.sent}`);
  console.log(`Failed:   ${result.failed}`);
  console.log(`Rejected: ${result.rejected.length}`);
  if (result.rejected.length > 0) {
    console.log("Rejected emails:", result.rejected);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
