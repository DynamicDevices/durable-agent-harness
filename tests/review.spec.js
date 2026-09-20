const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const reviews = fs
  .readdirSync(path.join(ROOT, "content", "review-drafts"))
  .filter((name) => name.endsWith(".json"))
  .map((name) => JSON.parse(fs.readFileSync(path.join(ROOT, "content", "review-drafts", name))));

test.describe("unlisted insight reviews", () => {
  for (const review of reviews) {
    test(`${review.id} is visibly draft-only and absent from discovery`, async ({ page, request }) => {
      const localPath = `/review/${review.id}.html`;
      await page.goto(localPath);

      await expect(page.locator("main h1")).toHaveText(review.title);
      await expect(page.getByText("Review draft — not published", { exact: true })).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex,nofollow,noarchive,nosnippet,noimageindex",
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
      await expect(page.locator('meta[property^="og:"]')).toHaveCount(0);
      await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
      await expect(page.getByText("Share this insight", { exact: true })).toHaveCount(0);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(overflow).toBeFalsy();

      for (const discoveryPath of ["/", "/feed.xml", "/sitemap.xml", "/llms.txt"]) {
        const source = await (await request.get(discoveryPath)).text();
        expect(source).not.toContain(review.id);
      }
    });
  }
});
