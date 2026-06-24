/**
 * Template generators for Studio of Phronesis.
 *
 * Each generator takes a payload (typed form data) and returns a Buffer
 * containing a .docx file. All templates compose the primitives from
 * ./primitives.ts to maintain brand consistency.
 */
import {
  buildDocument,
  metadataTable,
  valueTable,
  dataTable,
  sectionHeading,
  body,
  bullet,
  spacer,
  goldRule,
  callout,
  COLORS,
} from "./primitives";
import type { Paragraph, Table } from "docx";

// ─── 1. Demo Access Brief ──────────────────────────────────────────────────

export type DemoBriefPayload = {
  clientName: string;
  projectName: string;
  projectDescription: string;
  websiteUrl: string;
  adminUrl: string;
  adminEmail: string;
  adminPassword: string;
  evaluationPoints: string[]; // what to evaluate
  deadlineDate: string; // e.g. "Friday, 26 June 2026"
  deadlineTime: string; // e.g. "1:00 PM UAE Time (GST)"
  issuedDate?: string; // defaults to today
};

export async function generateDemoBrief(p: DemoBriefPayload): Promise<Buffer> {
  const issued = p.issuedDate || new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const bodyElements: (Paragraph | Table)[] = [
    metadataTable([
      { label: "Prepared for", value: p.clientName },
      { label: "Issued", value: `${issued} — GST` },
    ]),
    spacer(240),

    sectionHeading("Purpose"),
    body(
      `This brief grants you private access to the demonstration build of ${p.projectName}. ${p.projectDescription} The demo is pre-populated with sample data and configured for your evaluation. Please use this access to evaluate the platform against your requirements.`
    ),

    sectionHeading("Access Credentials"),
    valueTable(
      [
        { label: "Website", value: p.websiteUrl },
        { label: "Admin Dashboard", value: p.adminUrl },
        { label: "Email", value: p.adminEmail, valueColor: COLORS.TEAL },
        { label: "Password", value: p.adminPassword, valueColor: COLORS.TEAL },
      ],
      { firstColumnWidth: 30 }
    ),
    spacer(160),
    body(
      "Treat these credentials as confidential. Do not share them outside your evaluation team.",
      { italic: true, color: COLORS.INK_SOFT, size: 18 }
    ),

    sectionHeading("What to Evaluate"),
    ...p.evaluationPoints.map((pt) => bullet(pt)),

    callout(
      `${p.deadlineDate} · ${p.deadlineTime}`,
      [
        "This is a demonstration environment for evaluation only. After the deadline above, all credentials, access links, and sample data will be rotated.",
        "Please complete your review and communicate your decision before this time.",
      ],
      "gold"
    ),

    sectionHeading("Decision Deadline"),
    body(
      `Please communicate your decision on or before ${p.deadlineDate} at ${p.deadlineTime}. I will personally be available to answer any questions, walk you through any feature in detail, or adjust the scope to better fit your needs.`
    ),
    body(
      "Thank you for the opportunity to demonstrate what the Studio of Phronesis can build for your organization."
    ),
  ];

  const doc = buildDocument(bodyElements, { documentTitle: "Demonstration Access Brief" });
  return packDoc(doc);
}

// ─── 2. Software Quotation ─────────────────────────────────────────────────

export type SoftwareQuotePayload = {
  clientName: string;
  projectName: string;
  projectOverview: string;
  scopeItems: string[]; // bullet list of in-scope features
  deliverables: string[]; // what will be delivered
  timelinePhases: { phase: string; duration: string; deliverable: string }[];
  setupFee: string; // e.g. "8,000 AED"
  annualLicense: string; // e.g. "12,000 AED / year"
  totalFirstYear: string;
  terms: string[]; // terms & conditions bullets
  validUntil: string;
};

export async function generateSoftwareQuote(p: SoftwareQuotePayload): Promise<Buffer> {
  const bodyElements: (Paragraph | Table)[] = [
    metadataTable([
      { label: "Prepared for", value: p.clientName },
      { label: "Project", value: p.projectName },
      { label: "Valid until", value: p.validUntil },
    ]),
    spacer(240),

    sectionHeading("Project Overview"),
    body(p.projectOverview),

    sectionHeading("Scope of Work"),
    ...p.scopeItems.map((s) => bullet(s)),
    spacer(120),
    body("Out of scope: any features not listed above will be quoted separately.", {
      italic: true,
      color: COLORS.INK_SOFT,
      size: 18,
    }),

    sectionHeading("Deliverables"),
    ...p.deliverables.map((d) => bullet(d)),

    sectionHeading("Timeline"),
    dataTable(
      ["Phase", "Duration", "Deliverable"],
      p.timelinePhases.map((t) => [t.phase, t.duration, t.deliverable]),
      { accentColor: COLORS.TEAL, zebra: true, columnWidths: [35, 25, 40] }
    ),

    sectionHeading("Commercial"),
    valueTable(
      [
        { label: "Setup Fee (one-time)", value: p.setupFee, valueColor: COLORS.TEAL },
        { label: "Annual License", value: p.annualLicense, valueColor: COLORS.TEAL },
        { label: "Total — First Year", value: p.totalFirstYear, valueColor: COLORS.GOLD },
      ],
      { firstColumnWidth: 50 }
    ),
    spacer(160),

    sectionHeading("Terms & Conditions"),
    ...p.terms.map((t) => bullet(t)),

    callout(
      "Acceptance",
      [
        `This quotation is valid until ${p.validUntil}. To proceed, please sign and return this document, or send written confirmation by email.`,
        "A 50% deposit of the setup fee is due on commencement. The balance is due on delivery.",
      ],
      "teal"
    ),
  ];

  const doc = buildDocument(bodyElements, { documentTitle: "Software Quotation" });
  return packDoc(doc);
}

// ─── 3. Tutoring Quotation ─────────────────────────────────────────────────

export type TutoringQuotePayload = {
  studentName: string;
  subject: string; // e.g. "Philosophy & Critical Thinking"
  sessionFormat: string; // "In-person (Al Ain)" / "Online"
  sessionLength: string; // "60 minutes" / "90 minutes"
  perSession: string;
  packageSize: string; // "10 sessions"
  packagePrice: string;
  packageSavings: string; // e.g. "Save 500 AED"
  includes: string[];
  validUntil: string;
};

export async function generateTutoringQuote(p: TutoringQuotePayload): Promise<Buffer> {
  const bodyElements: (Paragraph | Table)[] = [
    metadataTable([
      { label: "Prepared for", value: p.studentName },
      { label: "Subject", value: p.subject },
      { label: "Format", value: p.sessionFormat },
      { label: "Valid until", value: p.validUntil },
    ]),
    spacer(240),

    sectionHeading("Engagement"),
    body(
      `This quotation covers structured tutoring in ${p.subject}. Sessions are ${p.sessionLength}, conducted ${p.sessionFormat}. The curriculum is tailored to the student's level and goals, with periodic progress reviews.`
    ),

    sectionHeading("Pricing"),
    valueTable(
      [
        { label: "Single Session", value: p.perSession },
        {
          label: `Package (${p.packageSize})`,
          value: p.packagePrice,
          valueColor: COLORS.TEAL,
        },
        { label: "Package Savings", value: p.packageSavings, valueColor: COLORS.GOLD },
      ],
      { firstColumnWidth: 50 }
    ),

    sectionHeading("What's Included"),
    ...p.includes.map((i) => bullet(i)),

    callout(
      "Booking & Cancellation",
      [
        "Sessions are booked in advance by mutual agreement.",
        "Cancellations within 24 hours of the scheduled session are charged at 50% of the session rate.",
        "Packages are valid for 6 months from the date of first session.",
      ],
      "teal"
    ),
  ];

  const doc = buildDocument(bodyElements, { documentTitle: "Tutoring Quotation" });
  return packDoc(doc);
}

// ─── 4. Consultancy Quotation ──────────────────────────────────────────────

export type ConsultancyQuotePayload = {
  clientName: string;
  clientOrg: string;
  engagementTitle: string; // e.g. "Operational Audit & Recommendations"
  objective: string;
  hourlyRate: string;
  fixedScope: string; // if fixed-scope
  fixedPrice: string;
  duration: string; // "2-4 weeks"
  deliverables: string[];
  methodology: string[];
  validUntil: string;
};

export async function generateConsultancyQuote(
  p: ConsultancyQuotePayload
): Promise<Buffer> {
  const bodyElements: (Paragraph | Table)[] = [
    metadataTable([
      { label: "Prepared for", value: `${p.clientName}${p.clientOrg ? ` · ${p.clientOrg}` : ""}` },
      { label: "Engagement", value: p.engagementTitle },
      { label: "Duration", value: p.duration },
      { label: "Valid until", value: p.validUntil },
    ]),
    spacer(240),

    sectionHeading("Objective"),
    body(p.objective),

    sectionHeading("Methodology"),
    ...p.methodology.map((m) => bullet(m)),

    sectionHeading("Deliverables"),
    ...p.deliverables.map((d) => bullet(d)),

    sectionHeading("Commercial Structure"),
    valueTable(
      [
        { label: "Hourly Rate", value: p.hourlyRate },
        { label: "Fixed Scope (this engagement)", value: p.fixedPrice, valueColor: COLORS.TEAL },
        { label: "Minimum Engagement", value: "90 minutes" },
      ],
      { firstColumnWidth: 50 }
    ),
    spacer(120),
    body(
      "Available in person (UAE) or remote. Travel outside Al Ain is billed separately at cost.",
      { italic: true, color: COLORS.INK_SOFT, size: 18 }
    ),

    callout(
      "Engagement Terms",
      [
        `This quotation is valid until ${p.validUntil}.`,
        "A 50% advance is due on commencement; the balance is due on delivery of the written diagnosis.",
        "Implementation support beyond the engagement scope is billed separately at the hourly rate.",
      ],
      "teal"
    ),
  ];

  const doc = buildDocument(bodyElements, { documentTitle: "Consultancy Quotation" });
  return packDoc(doc);
}

// ─── 5. Engagement Letter ──────────────────────────────────────────────────

export type EngagementLetterPayload = {
  clientName: string;
  clientOrg: string;
  engagementTitle: string;
  kickoffDate: string;
  scope: string;
  deliverables: string[];
  fee: string;
  paymentSchedule: string;
  contactEmail: string;
};

export async function generateEngagementLetter(
  p: EngagementLetterPayload
): Promise<Buffer> {
  const issued = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const bodyElements: (Paragraph | Table)[] = [
    body(`Date: ${issued}`, { color: COLORS.INK_SOFT }),
    spacer(120),
    body(`To: ${p.clientName}${p.clientOrg ? `, ${p.clientOrg}` : ""}`),
    body(`Re: ${p.engagementTitle}`),
    spacer(120),

    body(`Dear ${p.clientName.split(" ")[0]},`),

    body(
      `I am writing to confirm the engagement between you and Studio of Phronesis, effective ${p.kickoffDate}. This letter sets out the scope, deliverables, fee, and terms of our work together.`
    ),

    sectionHeading("Scope of Engagement"),
    body(p.scope),

    sectionHeading("Deliverables"),
    ...p.deliverables.map((d) => bullet(d)),

    sectionHeading("Fee & Payment"),
    valueTable(
      [
        { label: "Total Fee", value: p.fee, valueColor: COLORS.TEAL },
        { label: "Payment Schedule", value: p.paymentSchedule },
      ],
      { firstColumnWidth: 40 }
    ),

    sectionHeading("Communication"),
    body(
      `All formal communications regarding this engagement should be directed to ${p.contactEmail}. I will provide weekly written progress updates throughout the engagement.`
    ),

    body(
      "If the terms above reflect your understanding, please sign below and return one copy. I look forward to working with you."
    ),

    spacer(360),
    body("With regards,", { italic: true }),
    spacer(240),
    body("Ahmed Ali", { bold: true }),
    body("Studio of Phronesis", { color: COLORS.INK_SOFT, size: 18 }),
  ];

  const doc = buildDocument(bodyElements, { documentTitle: "Engagement Letter" });
  return packDoc(doc);
}

// ─── 6. Project Brief (internal scoping) ───────────────────────────────────

export type ProjectBriefPayload = {
  projectName: string;
  clientName: string;
  problemStatement: string;
  targetAudience: string;
  successMetrics: string[];
  constraints: string[];
  proposedApproach: string;
  openQuestions: string[];
  briefDate: string;
};

export async function generateProjectBrief(
  p: ProjectBriefPayload
): Promise<Buffer> {
  const bodyElements: (Paragraph | Table)[] = [
    metadataTable([
      { label: "Project", value: p.projectName },
      { label: "Client", value: p.clientName },
      { label: "Brief Date", value: p.briefDate },
    ]),
    spacer(240),

    sectionHeading("Problem Statement"),
    body(p.problemStatement),

    sectionHeading("Target Audience"),
    body(p.targetAudience),

    sectionHeading("Success Metrics"),
    ...p.successMetrics.map((m) => bullet(m, COLORS.GOLD)),

    sectionHeading("Constraints"),
    ...p.constraints.map((c) => bullet(c, COLORS.TERRACOTTA)),

    sectionHeading("Proposed Approach"),
    body(p.proposedApproach),

    sectionHeading("Open Questions"),
    ...p.openQuestions.map((q) => bullet(q, COLORS.INK_SOFT)),

    callout(
      "Internal Document",
      [
        "This brief is an internal scoping artifact. It will be the basis for the client-facing quotation and engagement letter.",
        "Update this document as scope becomes clearer during discovery.",
      ],
      "teal"
    ),
  ];

  const doc = buildDocument(bodyElements, { documentTitle: "Project Brief" });
  return packDoc(doc);
}

// ─── 7. Invoice ────────────────────────────────────────────────────────────

export type InvoicePayload = {
  invoiceNumber: string;
  clientName: string;
  clientOrg: string;
  issueDate: string;
  dueDate: string;
  lineItems: { description: string; qty: string; unitPrice: string; total: string }[];
  subtotal: string;
  vatRate: string; // "5%"
  vatAmount: string;
  total: string;
  paymentTerms: string;
  bankDetails: { label: string; value: string }[];
};

export async function generateInvoice(p: InvoicePayload): Promise<Buffer> {
  const bodyElements: (Paragraph | Table)[] = [
    metadataTable([
      { label: "Invoice #", value: p.invoiceNumber },
      { label: "Issued", value: p.issueDate },
      { label: "Due", value: p.dueDate },
    ]),
    spacer(160),
    body(`Billed to: ${p.clientName}${p.clientOrg ? `, ${p.clientOrg}` : ""}`, {
      bold: true,
    }),
    spacer(200),

    sectionHeading("Line Items"),
    dataTable(
      ["Description", "Qty", "Unit Price", "Total"],
      p.lineItems.map((li) => [li.description, li.qty, li.unitPrice, li.total]),
      { accentColor: COLORS.GOLD, zebra: true, columnWidths: [50, 12, 19, 19] }
    ),
    spacer(200),

    sectionHeading("Summary"),
    valueTable(
      [
        { label: "Subtotal", value: p.subtotal },
        { label: `VAT (${p.vatRate})`, value: p.vatAmount },
        { label: "Total Due", value: p.total, valueColor: COLORS.GOLD },
      ],
      { firstColumnWidth: 70 }
    ),
    spacer(200),

    sectionHeading("Payment Terms"),
    body(p.paymentTerms),

    sectionHeading("Bank Details"),
    valueTable(p.bankDetails, { firstColumnWidth: 35 }),

    callout(
      "Payment Due",
      [`Please remit payment by ${p.dueDate}. Late payments may incur a 2% monthly service charge.`],
      "terracotta"
    ),
  ];

  const doc = buildDocument(bodyElements, { documentTitle: `Invoice ${p.invoiceNumber}` });
  return packDoc(doc);
}

// ─── 8. Welcome Letter (post-close onboarding) ────────────────────────────

export type WelcomeLetterPayload = {
  clientName: string;
  engagementTitle: string;
  kickoffDate: string;
  kickoffTime: string;
  kickoffLocation: string; // "Zoom" or address
  kickoffLink?: string;
  whatHappensNext: string[];
  communicationCadence: string;
  contactEmail: string;
  contactPhone?: string;
};

export async function generateWelcomeLetter(
  p: WelcomeLetterPayload
): Promise<Buffer> {
  const bodyElements: (Paragraph | Table)[] = [
    body(
      `Dear ${p.clientName.split(" ")[0]},`,
      { size: 24 }
    ),
    spacer(120),

    body(
      `Welcome to Studio of Phronesis. I am delighted to begin our work together on ${p.engagementTitle}. This letter outlines what happens next, our first meeting, and how we will communicate throughout the engagement.`
    ),

    sectionHeading("Our First Meeting"),
    valueTable(
      [
        { label: "Date", value: p.kickoffDate },
        { label: "Time", value: p.kickoffTime },
        { label: "Location", value: p.kickoffLocation },
        ...(p.kickoffLink ? [{ label: "Link", value: p.kickoffLink, valueColor: COLORS.TEAL }] : []),
      ],
      { firstColumnWidth: 30 }
    ),

    sectionHeading("What Happens Next"),
    ...p.whatHappensNext.map((n) => bullet(n)),

    sectionHeading("Communication"),
    body(p.communicationCadence),
    body(
      `For anything related to this engagement, please reach me at ${p.contactEmail}${p.contactPhone ? ` or ${p.contactPhone}` : ""}. I typically respond within one business day.`
    ),

    body(
      "Thank you for trusting Studio of Phronesis with this work. I look forward to a productive and rewarding collaboration."
    ),

    spacer(360),
    body("Warm regards,", { italic: true }),
    spacer(240),
    body("Ahmed Ali", { bold: true }),
    body("Studio of Phronesis", { color: COLORS.INK_SOFT, size: 18 }),
  ];

  const doc = buildDocument(bodyElements, { documentTitle: "Welcome to the Studio" });
  return packDoc(doc);
}

// ─── Shared ────────────────────────────────────────────────────────────────

async function packDoc(doc: import("docx").Document): Promise<Buffer> {
  const { Packer } = await import("docx");
  return Packer.toBuffer(doc);
}

// ─── Template registry ─────────────────────────────────────────────────────

export const TEMPLATES = [
  {
    id: "demo-brief",
    name: "Demo Access Brief",
    description: "Grant a client private access to a demo build with credentials and a decision deadline.",
    icon: "🔑",
  },
  {
    id: "software-quote",
    name: "Software Quotation",
    description: "Scope, deliverables, timeline, and pricing for a custom software build.",
    icon: "💻",
  },
  {
    id: "tutoring-quote",
    name: "Tutoring Quotation",
    description: "Per-session and package pricing for tutoring engagements.",
    icon: "📚",
  },
  {
    id: "consultancy-quote",
    name: "Consultancy Quotation",
    description: "Hourly or fixed-scope strategic consultation with methodology and deliverables.",
    icon: "🎯",
  },
  {
    id: "engagement-letter",
    name: "Engagement Letter",
    description: "Formal letter confirming scope, deliverables, fee, and kickoff date.",
    icon: "✉️",
  },
  {
    id: "project-brief",
    name: "Project Brief",
    description: "Internal scoping document: problem, audience, success metrics, constraints.",
    icon: "📋",
  },
  {
    id: "invoice",
    name: "Invoice",
    description: "Branded invoice with line items, VAT, payment terms, and bank details.",
    icon: "🧾",
  },
  {
    id: "welcome-letter",
    name: "Welcome Letter",
    description: "Onboarding letter sent after a deal closes — kickoff details and what to expect.",
    icon: "👋",
  },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]["id"];

export async function generateTemplate(
  id: TemplateId,
  payload: unknown
): Promise<{ buffer: Buffer; fileName: string }> {
  const fileName = `${id}-${new Date().toISOString().slice(0, 10)}.docx`;
  let buffer: Buffer;

  switch (id) {
    case "demo-brief":
      buffer = await generateDemoBrief(payload as DemoBriefPayload);
      break;
    case "software-quote":
      buffer = await generateSoftwareQuote(payload as SoftwareQuotePayload);
      break;
    case "tutoring-quote":
      buffer = await generateTutoringQuote(payload as TutoringQuotePayload);
      break;
    case "consultancy-quote":
      buffer = await generateConsultancyQuote(payload as ConsultancyQuotePayload);
      break;
    case "engagement-letter":
      buffer = await generateEngagementLetter(payload as EngagementLetterPayload);
      break;
    case "project-brief":
      buffer = await generateProjectBrief(payload as ProjectBriefPayload);
      break;
    case "invoice":
      buffer = await generateInvoice(payload as InvoicePayload);
      break;
    case "welcome-letter":
      buffer = await generateWelcomeLetter(payload as WelcomeLetterPayload);
      break;
    default:
      throw new Error(`Unknown template: ${id}`);
  }

  return { buffer, fileName };
}
