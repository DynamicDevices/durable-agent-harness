const { test, expect } = require("@playwright/test");

const ORIGIN = "https://chopwoodcarrywater.uk";
const HOME_CARD = `${ORIGIN}/assets/og-cover-v2.png`;

test.describe("search and social discovery", () => {
  test("homepage metadata is complete before JavaScript", async ({ request }) => {
    const response = await request.get("/");
    expect(response.ok()).toBeTruthy();
    const source = await response.text();

    expect(source).toContain("<h1 id=\"hero-headline\">Durable Agent Harness</h1>");
    expect(source).toContain('<link rel="canonical" href="https://chopwoodcarrywater.uk/"');
    expect(source).toContain('<link rel="alternate" type="application/rss+xml"');
    expect(source).toContain('<link rel="sitemap" type="application/xml"');
    expect(source).toContain('meta name="robots" content="index,follow,max-image-preview:large');
  });

  test("homepage search snippet and LinkedIn card meet the production contract", async ({ page, request }) => {
    await page.goto("/");

    const title = await page.title();
    expect(title.length).toBeGreaterThanOrEqual(30);
    expect(title.length).toBeLessThanOrEqual(60);

    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description.length).toBeGreaterThanOrEqual(120);
    expect(description.length).toBeLessThanOrEqual(160);

    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", `${ORIGIN}/`);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", HOME_CARD);
    await expect(page.locator('meta[property="og:image:secure_url"]')).toHaveAttribute("content", HOME_CARD);
    await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute("content", "image/png");
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "627");
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /Durable Agent Harness/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator('meta[name="twitter:site"]')).toHaveAttribute("content", "@embedded_iot");
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", HOME_CARD);

    const cardResponse = await request.get("/assets/og-cover-v2.png");
    expect(cardResponse.ok()).toBeTruthy();
    expect(cardResponse.headers()["content-type"]).toContain("image/png");
    const card = await cardResponse.body();
    expect(card.length).toBeLessThanOrEqual(5 * 1024 * 1024);
    expect(card.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(card.readUInt32BE(16)).toBe(1200);
    expect(card.readUInt32BE(20)).toBe(627);
  });

  test("structured data identifies the page, article, author and exact card", async ({ page }) => {
    await page.goto("/");
    const data = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
    const byType = Object.fromEntries(data["@graph"].map((item) => [item["@type"], item]));

    expect(byType.WebSite.url).toBe(`${ORIGIN}/`);
    expect(byType.WebPage.isPartOf["@id"]).toBe(`${ORIGIN}/#website`);
    expect(byType.WebPage.primaryImageOfPage.url).toBe(HOME_CARD);
    expect(byType.WebPage.primaryImageOfPage.width).toBe(1200);
    expect(byType.WebPage.primaryImageOfPage.height).toBe(627);
    expect(byType.TechArticle.author["@id"]).toBe(`${ORIGIN}/#alex`);
    expect(byType.TechArticle.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(byType.TechArticle.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(byType.Person.name).toBe("Alex Lennon");
  });

  test("robots, sitemap and RSS expose the canonical public site", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    const sitemap = await (await request.get("/sitemap.xml")).text();
    const feed = await (await request.get("/feed.xml")).text();

    expect(robots).toContain("User-agent: *");
    expect(robots).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
    expect(sitemap).toContain(`<loc>${ORIGIN}/</loc>`);
    expect(sitemap).toContain(`<loc>${ORIGIN}/agents.html</loc>`);
    expect(sitemap).toContain("<lastmod>2026-09-05</lastmod>");
    expect(feed).toContain(`<link>${ORIGIN}/</link>`);
  });
});
