# E2E Test Suite — Studio of Phronesis

This directory contains end-to-end tests for the Studio of Phronesis website.

## Running Tests

```bash
# Install Playwright (one-time)
bunx playwright install

# Run all tests
bunx playwright test

# Run with browser visible
bunx playwright test --headed

# Run specific test file
bunx playwright test tests/production.spec.ts
```

## Test Coverage

1. **Public routes** — All EN and AR pages return 200
2. **API health** — `/api/lead` GET returns ok:true
3. **Contact form** — Valid submission returns 200, invalid returns 400
4. **Honeypot** — Bot submissions are silently rejected
5. **Admin auth** — Unauth access redirects, wrong password rejected, correct login works
6. **SEO** — Sitemap, robots.txt, manifest, OG images all accessible
7. **Security** — CSP headers present, admin API returns 401 without auth
8. **Static assets** — All PDFs, favicons, logos accessible

## Test Files

- `production.spec.ts` — Full production test suite (runs against phronesis-studio.com)
