# Studio of Phronesis

> Perceiving the gap between what is and what should be, and closing it with discipline.

The official website of Studio of Phronesis, a scholarly studio founded by Ahmed Ali in Al Ain, UAE. The studio builds custom software, educational platforms, and operational systems, and offers consultation and curriculum design.

## Tech Stack

- **Framework:** Next.js 16.1.3 (App Router, Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + tw-animate-css
- **UI Components:** shadcn/ui (Radix primitives)
- **Animations:** Framer Motion 12
- **i18n:** next-intl 4 (English + Arabic, RTL support)
- **Database:** PostgreSQL (Neon serverless)
- **ORM:** Prisma 6
- **Auth:** JWT (jose) in httpOnly cookies, bcryptjs password hashing
- **Email:** Brevo SMTP (nodemailer)
- **Document Generation:** docx (9 branded template types)
- **Fonts:** Cormorant Garamond, Source Serif 4, Inter, JetBrains Mono, Amiri (Arabic)
- **Runtime:** Bun (install), Node.js 24 (build)
- **Hosting:** Vercel (Hobby plan)

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Public site (en, ar)
│   │   ├── page.tsx       # Frontispiece (homepage)
│   │   ├── about/         # The Founder
│   │   ├── work/          # Selected Work (neural viz + tabs)
│   │   ├── echoes/        # Philosophy / Podcast
│   │   ├── library/       # Bilingual math guides
│   │   ├── method/        # The Method (4 steps)
│   │   └── correspondence/ # Contact form
│   ├── admin/             # Admin portal (auth-gated)
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout (SSR lang/dir)
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt
├── components/
│   ├── sections/          # Page sections (Hero, Thesis, Work, etc.)
│   ├── admin/             # Admin portal components
│   ├── ui/                # shadcn/ui primitives
│   ├── anim.tsx           # Animation utilities (Reveal, Magnetic, Tilt3D)
│   ├── FloatingEagle.tsx  # Persistent eagle watermark
│   └── JsonLd.tsx         # Structured data (Organization, Person, WebSite)
├── lib/
│   ├── auth.ts            # JWT auth + session management
│   ├── db.ts              # Prisma client (singleton)
│   ├── email.ts           # Brevo SMTP + templated emails
│   ├── episodes.ts        # Echoes episode loader
│   └── docx/              # DOCX template generation
├── i18n/
│   ├── routing.ts         # Locale config (en, ar)
│   └── request.ts         # Message loader (JSON + DB deep-merge)
├── messages/
│   ├── en.json            # English translations (fallback)
│   └── ar.json            # Arabic translations (fallback)
└── prisma/
    └── schema.prisma      # Database schema (5 tables)
```

## Database Schema

| Table | Purpose |
|-------|---------|
| `leads` | Contact form submissions |
| `site_content` | Editable i18n content (locale + namespace + JSON) |
| `episodes` | Echoes podcast transcripts (bilingual) |
| `template_logs` | Audit log of generated DOCX templates |
| `sent_emails` | Log of emails sent from admin portal |

## Local Development

```bash
# Clone
git clone https://github.com/ahmedphronesis/phronesis-studio.git
cd phronesis-studio

# Install
bun install

# Create .env with required variables:
# DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_JWT_SECRET,
# SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL, NOTIFY_EMAIL

# Generate Prisma client
bunx prisma generate

# Run dev server
bun run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin password (plaintext, timing-safe compared) |
| `ADMIN_JWT_SECRET` | 64-hex secret for JWT signing |
| `SMTP_HOST` | Brevo SMTP relay host |
| `SMTP_PORT` | Brevo SMTP port (587) |
| `SMTP_USER` | Brevo SMTP login |
| `SMTP_PASS` | Brevo SMTP key |
| `CONTACT_EMAIL` | From address for emails |
| `NOTIFY_EMAIL` | Where lead notifications are sent |

## Deployment

Pushes to `main` branch automatically trigger a Vercel deployment.

- **Production URL:** https://phronesis-studio.com
- **Admin Portal:** https://phronesis-studio.com/admin
- **API Health Check:** GET https://phronesis-studio.com/api/lead

## Key Features

- **Bilingual (EN/AR)** with full RTL support and scholarly Arabic typography (Amiri font)
- **Neural Network Visualization** on the Work page (SVG clouds + animated pathways)
- **Admin Portal** with content editor, lead management, email composition, DOCX generation
- **Echoes Podcast** with 8 bilingual episodes and full transcripts
- **Bilingual Math Library** (Grades 1-4 live, 5-12 in production)
- **CSP + Security Headers** (Content-Security-Policy, X-Frame-Options, etc.)
- **SEO** with per-page metadata, JSON-LD structured data, sitemap, robots.txt
- **Contact form** with Zod validation, honeypot spam protection, dual email (confirmation + notification)

## i18n Architecture

Messages load via a **deep-merge** of JSON files and Neon database rows:
1. Start with `messages/{locale}.json` as the base
2. Override with `site_content` DB rows (per-namespace)
3. Deep-merge at the object level so new JSON sub-keys appear immediately without DB re-seeding

This allows:
- Admin to edit content live via `/admin/content`
- New namespaces to ship via JSON without database migration
- Site to remain functional if Neon is down (JSON fallback)

## License

Proprietary. All rights reserved. Studio of Phronesis.
