"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileEdit,
  Loader2,
  Download,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Check,
  AlertCircle,
} from "lucide-react";

// ─── Template schemas (drive the form rendering) ───────────────────────────

type FieldType = "text" | "textarea" | "number" | "list" | "object-list";

type Field = {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: string | string[];
  helpText?: string;
  // for object-list
  subFields?: { key: string; label: string; placeholder?: string }[];
};

type TemplateSchema = {
  id: string;
  name: string;
  description: string;
  icon: string;
  fields: Field[];
};

const SCHEMAS: TemplateSchema[] = [
  {
    id: "demo-brief",
    name: "Demo Access Brief",
    description: "Grant a client private access to a demo build with credentials and a decision deadline.",
    icon: "🔑",
    fields: [
      { key: "clientName", label: "Client Name", type: "text", placeholder: "Mohammed Mosa Ali", defaultValue: "" },
      { key: "projectName", label: "Project Name", type: "text", placeholder: "Al Ain Properties, Real Estate Platform", defaultValue: "" },
      { key: "projectDescription", label: "Project Description", type: "textarea", placeholder: "A bilingual, mobile-responsive website engineered for property listings, WhatsApp-driven inquiries, and a full administrative dashboard.", defaultValue: "" },
      { key: "websiteUrl", label: "Website URL", type: "text", placeholder: "https://your-demo.vercel.app", defaultValue: "" },
      { key: "adminUrl", label: "Admin Dashboard URL", type: "text", placeholder: "https://your-demo.vercel.app/admin", defaultValue: "/admin" },
      { key: "adminEmail", label: "Admin Email", type: "text", placeholder: "admin@example.com", defaultValue: "admin@demo.com" },
      { key: "adminPassword", label: "Admin Password", type: "text", placeholder: "DemoPassword123!", defaultValue: "" },
      { key: "evaluationPoints", label: "What to Evaluate", type: "list", helpText: "One point per line. Each will become a bullet in the document.", defaultValue: [
        "Bilingual Arabic/English interface with mobile responsiveness",
        "Search and filtering across all listings",
        "Admin dashboard: add/edit items, manage inquiries",
        "WhatsApp integration for inquiries and bookings",
      ]},
      { key: "deadlineDate", label: "Deadline Date", type: "text", placeholder: "Friday, 26 June 2026", defaultValue: "" },
      { key: "deadlineTime", label: "Deadline Time", type: "text", placeholder: "1:00 PM UAE Time (GST)", defaultValue: "1:00 PM UAE Time (GST)" },
    ],
  },
  {
    id: "software-quote",
    name: "Software Quotation",
    description: "Scope, deliverables, timeline, and pricing for a custom software build.",
    icon: "💻",
    fields: [
      { key: "clientName", label: "Client Name", type: "text", placeholder: "Mohammed Ali" },
      { key: "projectName", label: "Project Name", type: "text", placeholder: "Property Management Platform" },
      { key: "projectOverview", label: "Project Overview", type: "textarea", placeholder: "A brief description of what will be built and why." },
      { key: "scopeItems", label: "Scope of Work", type: "list", helpText: "One feature per line." , defaultValue: [
        "Custom user authentication and role-based access",
        "Property listings with photo upload",
        "Tenant management and rent tracking",
        "Inquiry and viewing booking system",
      ]},
      { key: "deliverables", label: "Deliverables", type: "list", defaultValue: [
        "Production web application deployed to Vercel",
        "Admin dashboard",
        "Source code and documentation",
        "30 days post-launch support",
      ]},
      { key: "timelinePhases", label: "Timeline Phases", type: "object-list", subFields: [
        { key: "phase", label: "Phase", placeholder: "Discovery" },
        { key: "duration", label: "Duration", placeholder: "1 week" },
        { key: "deliverable", label: "Deliverable", placeholder: "Written spec" },
      ]},
      { key: "setupFee", label: "Setup Fee (one-time)", type: "text", placeholder: "$4,500" },
      { key: "annualLicense", label: "Annual License", type: "text", placeholder: "$2,500 / year" },
      { key: "totalFirstYear", label: "Total, First Year", type: "text", placeholder: "$7,000" },
      { key: "terms", label: "Terms & Conditions", type: "list", defaultValue: [
        "50% setup fee due on commencement, 50% on delivery",
        "Annual license covers updates, security patches, and support",
        "Custom features beyond scope quoted separately",
      ]},
      { key: "validUntil", label: "Valid Until", type: "text", placeholder: "30 days from issue date" },
    ],
  },
  {
    id: "tutoring-quote",
    name: "Tutoring Quotation",
    description: "Per-session and package pricing for tutoring engagements.",
    icon: "📚",
    fields: [
      { key: "studentName", label: "Student Name", type: "text", placeholder: "Ahmed Ali" },
      { key: "subject", label: "Subject", type: "text", placeholder: "Philosophy & Critical Thinking" },
      { key: "sessionFormat", label: "Session Format", type: "text", placeholder: "In-person (Al Ain) or Online" },
      { key: "sessionLength", label: "Session Length", type: "text", placeholder: "60 minutes" },
      { key: "perSession", label: "Per-Session Price", type: "text", placeholder: "$75" },
      { key: "packageSize", label: "Package Size", type: "text", placeholder: "10 sessions" },
      { key: "packagePrice", label: "Package Price", type: "text", placeholder: "$650" },
      { key: "packageSavings", label: "Package Savings", type: "text", placeholder: "Save $100" },
      { key: "includes", label: "What's Included", type: "list", defaultValue: [
        "Tailored curriculum and lesson plans",
        "Weekly progress notes",
        "Parent/guardian updates (for younger students)",
        "Practice materials and reading lists",
      ]},
      { key: "validUntil", label: "Valid Until", type: "text", placeholder: "30 days from issue date" },
    ],
  },
  {
    id: "consultancy-quote",
    name: "Consultancy Quotation",
    description: "Hourly or fixed-scope strategic consultation with methodology and deliverables.",
    icon: "🎯",
    fields: [
      { key: "clientName", label: "Client Name", type: "text", placeholder: "Mohammed Ali" },
      { key: "clientOrg", label: "Client Organization", type: "text", placeholder: "Al Ain Properties (optional)" },
      { key: "engagementTitle", label: "Engagement Title", type: "text", placeholder: "Operational Audit & Recommendations" },
      { key: "objective", label: "Objective", type: "textarea", placeholder: "What the consultancy will achieve." },
      { key: "hourlyRate", label: "Hourly Rate", type: "text", placeholder: "$180 / hour" },
      { key: "fixedPrice", label: "Fixed Scope Price", type: "text", placeholder: "$1,200" },
      { key: "duration", label: "Duration", type: "text", placeholder: "2-4 weeks" },
      { key: "methodology", label: "Methodology", type: "list", defaultValue: [
        "Discovery interviews with key stakeholders",
        "Document and process review",
        "Diagnosis with prioritized recommendations",
        "Implementation support during rollout",
      ]},
      { key: "deliverables", label: "Deliverables", type: "list", defaultValue: [
        "Written diagnosis document",
        "Prioritized recommendation matrix",
        "Follow-up support during implementation",
      ]},
      { key: "validUntil", label: "Valid Until", type: "text", placeholder: "30 days from issue date" },
    ],
  },
  {
    id: "engagement-letter",
    name: "Engagement Letter",
    description: "Formal letter confirming scope, deliverables, fee, and kickoff date.",
    icon: "✉️",
    fields: [
      { key: "clientName", label: "Client Name", type: "text", placeholder: "Mohammed Ali" },
      { key: "clientOrg", label: "Client Organization", type: "text", placeholder: "Optional" },
      { key: "engagementTitle", label: "Engagement Title", type: "text", placeholder: "Property Management Platform Build" },
      { key: "kickoffDate", label: "Kickoff Date", type: "text", placeholder: "Monday, 1 July 2026" },
      { key: "scope", label: "Scope of Engagement", type: "textarea", placeholder: "Describe what is in scope." },
      { key: "deliverables", label: "Deliverables", type: "list", defaultValue: [
        "Production web application",
        "Admin dashboard",
        "Source code",
      ]},
      { key: "fee", label: "Total Fee", type: "text", placeholder: "$7,000" },
      { key: "paymentSchedule", label: "Payment Schedule", type: "text", placeholder: "50% on commencement, 50% on delivery" },
      { key: "contactEmail", label: "Contact Email", type: "text", placeholder: "ahmed@phronesis-studio.com", defaultValue: "ahmed@phronesis-studio.com" },
    ],
  },
  {
    id: "project-brief",
    name: "Project Brief",
    description: "Internal scoping document: problem, audience, success metrics, constraints.",
    icon: "📋",
    fields: [
      { key: "projectName", label: "Project Name", type: "text", placeholder: "Treasury Emperor" },
      { key: "clientName", label: "Client Name", type: "text", placeholder: "Internal / TBD" },
      { key: "problemStatement", label: "Problem Statement", type: "textarea", placeholder: "What gap exists today? What is broken or missing?" },
      { key: "targetAudience", label: "Target Audience", type: "textarea", placeholder: "Who will use this? Who will benefit?" },
      { key: "successMetrics", label: "Success Metrics", type: "list", defaultValue: [
        "Time saved per week per user",
        "Reduction in manual errors",
        "User adoption rate",
      ]},
      { key: "constraints", label: "Constraints", type: "list", defaultValue: [
        "Budget ceiling",
        "Timeline deadline",
        "Compliance requirements (PDPL, ADEK, ISO)",
      ]},
      { key: "proposedApproach", label: "Proposed Approach", type: "textarea", placeholder: "How will we close the gap?" },
      { key: "openQuestions", label: "Open Questions", type: "list", defaultValue: [
        "Who are the primary users?",
        "What integrations are required?",
      ]},
      { key: "briefDate", label: "Brief Date", type: "text", placeholder: "Today's date" },
    ],
  },
  {
    id: "invoice",
    name: "Invoice",
    description: "Branded invoice with line items, VAT, payment terms, and bank details.",
    icon: "🧾",
    fields: [
      { key: "invoiceNumber", label: "Invoice #", type: "text", placeholder: "INV-2026-001" },
      { key: "clientName", label: "Client Name", type: "text", placeholder: "Mohammed Ali" },
      { key: "clientOrg", label: "Client Organization", type: "text", placeholder: "Optional" },
      { key: "issueDate", label: "Issue Date", type: "text", placeholder: "24 June 2026" },
      { key: "dueDate", label: "Due Date", type: "text", placeholder: "24 July 2026" },
      { key: "lineItems", label: "Line Items", type: "object-list", subFields: [
        { key: "description", label: "Description", placeholder: "Custom software build, setup fee" },
        { key: "qty", label: "Qty", placeholder: "1" },
        { key: "unitPrice", label: "Unit Price", placeholder: "$4,500" },
        { key: "total", label: "Total", placeholder: "$4,500" },
      ]},
      { key: "subtotal", label: "Subtotal", type: "text", placeholder: "$4,500" },
      { key: "vatRate", label: "VAT / Sales Tax Rate", type: "text", placeholder: "5%", defaultValue: "5%" },
      { key: "vatAmount", label: "VAT / Tax Amount", type: "text", placeholder: "$225" },
      { key: "total", label: "Total Due", type: "text", placeholder: "$4,725" },
      { key: "paymentTerms", label: "Payment Terms", type: "textarea", placeholder: "Net 30 days from issue date. Payment by bank transfer.", defaultValue: "Net 30 days from issue date. Payment by bank transfer." },
      { key: "bankDetails", label: "Bank Details (one per line, label: value)", type: "object-list", subFields: [
        { key: "label", label: "Label", placeholder: "Bank" },
        { key: "value", label: "Value", placeholder: "ADCB" },
      ]},
    ],
  },
  {
    id: "welcome-letter",
    name: "Welcome Letter",
    description: "Onboarding letter sent after a deal closes, kickoff details and what to expect.",
    icon: "👋",
    fields: [
      { key: "clientName", label: "Client Name", type: "text", placeholder: "Mohammed Ali" },
      { key: "engagementTitle", label: "Engagement Title", type: "text", placeholder: "Property Management Platform Build" },
      { key: "kickoffDate", label: "Kickoff Date", type: "text", placeholder: "Monday, 1 July 2026" },
      { key: "kickoffTime", label: "Kickoff Time", type: "text", placeholder: "10:00 AM GST" },
      { key: "kickoffLocation", label: "Kickoff Location", type: "text", placeholder: "Zoom (online) or in-person" },
      { key: "kickoffLink", label: "Kickoff Link (optional)", type: "text", placeholder: "https://zoom.us/j/..." },
      { key: "whatHappensNext", label: "What Happens Next", type: "list", defaultValue: [
        "Discovery session to align on goals and scope",
        "Written specification within 5 business days",
        "Build cycles with weekly progress demos",
        "Production launch followed by 30 days of support",
      ]},
      { key: "communicationCadence", label: "Communication Cadence", type: "textarea", placeholder: "Weekly written progress updates. Available by email for ad-hoc questions.", defaultValue: "Weekly written progress updates. Available by email for ad-hoc questions." },
      { key: "contactEmail", label: "Contact Email", type: "text", placeholder: "ahmed@phronesis-studio.com", defaultValue: "ahmed@phronesis-studio.com" },
      { key: "contactPhone", label: "Contact Phone (optional)", type: "text", placeholder: "+971..." },
    ],
  },
];

// ─── Helper to build initial form state from schema ─────────────────────────

function initialFormState(schema: TemplateSchema): Record<string, unknown> {
  const state: Record<string, unknown> = {};
  for (const field of schema.fields) {
    if (field.type === "list") {
      const def = field.defaultValue;
      state[field.key] = Array.isArray(def) ? [...def] : [""];
    } else if (field.type === "object-list") {
      state[field.key] = [{}];
    } else {
      state[field.key] = field.defaultValue ?? "";
    }
  }
  return state;
}

// ─── Main page ─────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const [selected, setSelected] = useState<TemplateSchema | null>(null);
  const [formState, setFormState] = useState<Record<string, unknown>>({});
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function selectTemplate(schema: TemplateSchema) {
    setSelected(schema);
    setFormState(initialFormState(schema));
    setError(null);
    setSuccess(false);
  }

  function backToList() {
    setSelected(null);
    setFormState({});
    setError(null);
    setSuccess(false);
  }

  async function onGenerate() {
    if (!selected) return;
    setGenerating(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/templates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: selected.id,
          payload: formState,
          clientName: (formState.clientName as string) || (formState.studentName as string) || null,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || `Generation failed (HTTP ${res.status})`);
      }

      // Trigger download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selected.id}-${new Date().toISOString().slice(0, 10)}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  // Template list view
  if (!selected) {
    return (
      <div className="space-y-6">
        <header>
          <h1
            className="text-3xl text-[#1A1A1A]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Templates
          </h1>
          <p className="text-sm text-[#666] mt-1">
            Pick a template, fill in the form, download a polished .docx ·
            ready to send.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCHEMAS.map((schema) => (
            <button
              key={schema.id}
              onClick={() => selectTemplate(schema)}
              className="group text-left bg-white border border-[#E5DDD0] rounded-2xl p-5 hover:border-[#0F5C5E]/40 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#F5EFE4] border border-[#E5DDD0] flex items-center justify-center text-2xl flex-shrink-0">
                  {schema.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className="text-base text-[#1A1A1A]"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {schema.name}
                    </h3>
                    <ArrowRight
                      size={14}
                      className="text-[#999] group-hover:text-[#0F5C5E] group-hover:translate-x-1 transition-all"
                    />
                  </div>
                  <p className="text-xs text-[#666] mt-1 leading-relaxed">
                    {schema.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={backToList}
            className="mt-1 text-[#999] hover:text-[#1A1A1A] p-2 -ml-2 rounded-lg transition-colors"
            aria-label="Back to templates"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selected.icon}</span>
              <h1
                className="text-3xl text-[#1A1A1A]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {selected.name}
              </h1>
            </div>
            <p className="text-sm text-[#666] mt-1">{selected.description}</p>
          </div>
        </div>
      </header>

      <div className="bg-white border border-[#E5DDD0] rounded-2xl p-6 md:p-8 space-y-6">
        {selected.fields.map((field) => (
          <FieldRenderer
            key={field.key}
            field={field}
            value={formState[field.key]}
            onChange={(v) =>
              setFormState((prev) => ({ ...prev, [field.key]: v }))
            }
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 sticky bottom-4 bg-[#F5EFE4] border border-[#E5DDD0] rounded-2xl p-4 shadow-sm">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-sm text-[#B5462A] flex items-center gap-2"
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}
          {success && !error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-sm text-[#2D6A4F] flex items-center gap-2"
            >
              <Check size={14} />
              Document downloaded. Check your downloads folder.
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={backToList}
            className="text-sm text-[#666] hover:text-[#1A1A1A] px-4 py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 bg-[#0F5C5E] hover:bg-[#1A6E70] disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {generating ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Download size={14} />
                Generate .docx
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Field renderer ─────────────────────────────────────────────────────────

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const labelEl = (
    <label className="block text-[11px] uppercase tracking-[0.22em] text-[#0F5C5E] mb-2 font-mono">
      {field.label}
    </label>
  );

  const helpEl = field.helpText && (
    <p className="text-xs text-[#999] mt-1.5">{field.helpText}</p>
  );

  if (field.type === "text" || field.type === "number") {
    return (
      <div>
        {labelEl}
        <input
          type={field.type === "number" ? "number" : "text"}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] focus:ring-1 focus:ring-[#0F5C5E]/40 transition-colors"
        />
        {helpEl}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        {labelEl}
        <textarea
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="w-full bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] focus:ring-1 focus:ring-[#0F5C5E]/40 transition-colors resize-y"
        />
        {helpEl}
      </div>
    );
  }

  if (field.type === "list") {
    const items = (value as string[]) || [""];
    return (
      <div>
        {labelEl}
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[#0F5C5E] mt-2.5 text-sm">·</span>
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = e.target.value;
                  onChange(next);
                }}
                placeholder={field.placeholder || "Enter a line…"}
                className="flex-1 bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] transition-colors"
              />
              <button
                onClick={() => {
                  const next = items.filter((_, idx) => idx !== i);
                  onChange(next.length === 0 ? [""] : next);
                }}
                className="text-[#999] hover:text-[#B5462A] p-2 mt-0.5 rounded transition-colors"
                aria-label="Remove"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => onChange([...items, ""])}
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#0F5C5E] hover:text-[#1A6E70] font-medium"
        >
          <Plus size={12} />
          Add line
        </button>
        {helpEl}
      </div>
    );
  }

  if (field.type === "object-list") {
    const rows = (value as Record<string, string>[]) || [{}];
    return (
      <div>
        {labelEl}
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start bg-[#FAFAF7] border border-[#E5DDD0] rounded-lg p-3"
            >
              {field.subFields?.map((sf) => (
                <div
                  key={sf.key}
                  className={
                    field.subFields!.length === 4 ? "md:col-span-3" : "md:col-span-6"
                  }
                >
                  <label className="block text-[9px] uppercase tracking-wider text-[#999] mb-1 font-mono">
                    {sf.label}
                  </label>
                  <input
                    type="text"
                    value={row[sf.key] || ""}
                    onChange={(e) => {
                      const next = [...rows];
                      next[i] = { ...next[i], [sf.key]: e.target.value };
                      onChange(next);
                    }}
                    placeholder={sf.placeholder}
                    className="w-full bg-white border border-[#E5DDD0] rounded px-2.5 py-1.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] transition-colors"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  const next = rows.filter((_, idx) => idx !== i);
                  onChange(next.length === 0 ? [{}] : next);
                }}
                className="md:col-span-12 text-[#999] hover:text-[#B5462A] p-1 text-xs inline-flex items-center gap-1 justify-self-end"
              >
                <Trash2 size={12} />
                Remove row
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => onChange([...rows, {}])}
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#0F5C5E] hover:text-[#1A6E70] font-medium"
        >
          <Plus size={12} />
          Add row
        </button>
        {helpEl}
      </div>
    );
  }

  return null;
}
