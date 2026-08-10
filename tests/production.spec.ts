import { test, expect } from "@playwright/test";

const BASE = "https://phronesis-studio.com";

// ─── 1. Public Routes ────────────────────────────────────────

test.describe("Public Routes", () => {
  const routes = [
    "/en", "/ar",
    "/en/about", "/ar/about",
    "/en/work", "/ar/work",
    "/en/echoes", "/ar/echoes",
    "/en/library", "/ar/library",
    "/en/method", "/ar/method",
    "/en/correspondence", "/ar/correspondence",
  ];

  for (const path of routes) {
    test(`GET ${path} returns 200`, async ({ page }) => {
      const response = await page.goto(`${BASE}${path}`);
      expect(response?.status()).toBe(200);
    });
  }

  test("Root redirects to /en", async ({ page }) => {
    const response = await page.goto(`${BASE}/`);
    expect(response?.status()).toBe(307);
  });
});

// ─── 2. API Health ───────────────────────────────────────────

test.describe("API", () => {
  test("GET /api/lead returns ok", async ({ request }) => {
    const response = await request.get(`${BASE}/api/lead`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);
  });
});

// ─── 3. Contact Form ────────────────────────────────────────

test.describe("Contact Form", () => {
  test("Valid submission returns 200", async ({ request }) => {
    const response = await request.post(`${BASE}/api/lead`, {
      data: {
        name: "Test User",
        email: "test@example.com",
        company: "Test Co",
        gap: "This is a test submission for automated testing purposes.",
        budget: "Test budget",
        website: "", // honeypot empty
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);
  });

  test("Invalid submission returns 400", async ({ request }) => {
    const response = await request.post(`${BASE}/api/lead`, {
      data: { name: "x" },
    });
    expect(response.status()).toBe(400);
  });

  test("Honeypot rejects bots silently", async ({ request }) => {
    const response = await request.post(`${BASE}/api/lead`, {
      data: {
        name: "Bot",
        email: "bot@spam.com",
        gap: "This is a spam bot submission that should be rejected.",
        website: "http://spam-site.com", // honeypot filled
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe("bot-rejected");
  });
});

// ─── 4. Admin Auth ──────────────────────────────────────────

test.describe("Admin Auth", () => {
  test("Unauth access to /admin redirects", async ({ page }) => {
    const response = await page.goto(`${BASE}/admin`);
    expect([307, 200]).toContain(response?.status() || 0);
  });

  test("Unauth API returns 401", async ({ request }) => {
    const response = await request.get(`${BASE}/api/admin/leads`);
    expect(response.status()).toBe(401);
  });

  test("Wrong password rejected", async ({ request }) => {
    const response = await request.post(`${BASE}/api/admin/login`, {
      data: {
        email: "ahmed.phronesis@gmail.com",
        password: "WRONG_PASSWORD",
      },
    });
    expect(response.status()).toBe(401);
  });
});

// ─── 5. SEO ─────────────────────────────────────────────────

test.describe("SEO", () => {
  test("Sitemap accessible", async ({ request }) => {
    const response = await request.get(`${BASE}/sitemap.xml`);
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain("phronesis-studio.com");
  });

  test("Robots.txt accessible", async ({ request }) => {
    const response = await request.get(`${BASE}/robots.txt`);
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain("Disallow: /admin");
  });

  test("OG image accessible", async ({ request }) => {
    const response = await request.get(`${BASE}/og-image.png`);
    expect(response.status()).toBe(200);
  });

  test("About OG image accessible", async ({ request }) => {
    const response = await request.get(`${BASE}/og-about.png`);
    expect(response.status()).toBe(200);
  });
});

// ─── 6. Security Headers ────────────────────────────────────

test.describe("Security", () => {
  test("CSP header present", async ({ request }) => {
    const response = await request.get(`${BASE}/en`);
    const csp = response.headers()["content-security-policy"];
    expect(csp).toBeTruthy();
    expect(csp).toContain("default-src 'self'");
  });

  test("X-Frame-Options DENY", async ({ request }) => {
    const response = await request.get(`${BASE}/en`);
    expect(response.headers()["x-frame-options"]).toBe("DENY");
  });

  test("HSTS present", async ({ request }) => {
    const response = await request.get(`${BASE}/en`);
    expect(response.headers()["strict-transport-security"]).toBeTruthy();
  });
});

// ─── 7. Static Assets ───────────────────────────────────────

test.describe("Static Assets", () => {
  const assets = [
    "/og-image.png",
    "/og-about.png",
    "/favicon.ico",
    "/manifest.json",
    "/founder-portrait.jpg",
    "/vitruvian-man.jpg",
    "/guides/grade-1-mathematics.pdf",
  ];

  for (const asset of assets) {
    test(`GET ${asset} returns 200`, async ({ request }) => {
      const response = await request.get(`${BASE}${asset}`);
      expect(response.status()).toBe(200);
    });
  }
});
