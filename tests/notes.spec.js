const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const ORIGIN = "https://chopwoodcarrywater.uk";
const blog = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "blog.json"), "utf8"));

test.describe("shareable notes", () => {
  test("homepage contains crawlable note links before JavaScript", async ({ request }) => {
    const response = await request.get("/");
    expect(response.ok()).toBeTruthy();
    const source = await response.text();
    for (const post of blog.posts.slice(0, 4)) {
      expect(source).toContain(`notes/${post.id}.html`);
    }
  });

  test("RSS and sitemap discover every note without hash URLs", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    const feed = await (await request.get("/feed.xml")).text();
    expect(sitemap).not.toContain("#");
    for (const post of blog.posts) {
      const canonical = `${ORIGIN}/notes/${post.id}.html`;
      expect(sitemap).toContain(canonical);
      expect(feed).toContain(canonical);
    }
  });

  for (const post of blog.posts) {
    test(`${post.id} has article metadata, card and sharing`, async ({ page }) => {
      const localPath = `/notes/${post.id}.html`;
      const canonical = `${ORIGIN}${localPath}`;
      await page.goto(localPath);

      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.locator("main h1")).toHaveText(post.title);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", post.summary);
      expect(post.summary.length).toBeGreaterThanOrEqual(50);
      expect(post.summary.length).toBeLessThanOrEqual(170);
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonical);
      await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
      await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "627");
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        "summary_large_image",
      );

      const jsonLd = JSON.parse(
        await page.locator('script[type="application/ld+json"]').textContent(),
      );
      expect(jsonLd["@type"]).toBe("BlogPosting");
      expect(jsonLd.url).toBe(canonical);
      expect(jsonLd.image.width).toBe(1200);
      expect(jsonLd.image.height).toBe(627);

      const card = page.locator(".note-hero img");
      await expect(card).toHaveJSProperty("naturalWidth", 1200);
      await expect(card).toHaveJSProperty("naturalHeight", 627);
      await expect(card).toHaveAttribute("alt", /Illustrated title card/);
      await expect(page.locator('a[href*="linkedin.com/sharing/share-offsite/"]')).toHaveAttribute(
        "href",
        new RegExp(encodeURIComponent(canonical).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      );

      const copy = page.locator(".copy-link");
      await expect(copy).toHaveAttribute("data-copy-url", canonical);
      await copy.click();
      await expect(page.locator(".copy-link__status")).toHaveText("Link copied.");

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(overflow).toBeFalsy();
      await expect(page.locator("main img:not([alt])")).toHaveCount(0);
    });
  }
});
