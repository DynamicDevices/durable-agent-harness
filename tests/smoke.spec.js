const { test, expect } = require("@playwright/test");

test.describe("Durable Agent Harness site", () => {
  test("hero brands first and primary CTA works", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true", { timeout: 20000 });
    await expect(page.getByTestId("brand")).toBeVisible();
    await expect(page.getByTestId("hero")).toContainText("Active-ESL");
    await expect(page.getByTestId("hero")).toContainText("Durable Agent Harness");
    const brand = page.locator(".hero-brand");
    const brandSize = await brand.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    const h1Size = await page.locator(".hero h1").evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(brandSize).toBeGreaterThan(h1Size);
    await expect(brand).toHaveText("Active-ESL");

    await page.getByTestId("cta-explore").click();
    await expect(page.getByTestId("section-explore")).toBeInViewport();
  });

  test("start paths and clocks render", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    await expect(page.getByTestId("section-start")).toContainText("Playbook");
    await expect(page.getByTestId("section-start")).toContainText("Kaizen → TWP");
    await expect(page.getByTestId("section-start")).toContainText("Preloop + OpenRouter");
    await expect(page.getByTestId("section-start")).toContainText("Channels & lean");
    await expect(page.getByTestId("clock-serious_ai")).toBeVisible();
    await expect(page.getByTestId("clock-cursor")).toBeVisible();
    await expect(page.getByTestId("clock-harness")).toBeVisible();
    await expect(page.getByTestId("stat-strip")).toContainText("Agent skills");
    await expect(page.getByTestId("stat-strip")).toContainText("69");
  });

  test("playbook, cases, measure, and starters sections load", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    await expect(page.getByTestId("section-playbook")).toContainText("Build your own harness");
    await expect(page.locator("#playbook-steps .step-card")).toHaveCount(12);
    await expect(page.getByTestId("section-learning")).toContainText("MemPalace");
    await expect(page.getByTestId("section-learning")).toContainText("Toyota Way Practices");
    await expect(page.locator("#learning-flow .flow-card")).toHaveCount(5);
    await expect(page.getByTestId("section-runtime")).toContainText("Preloop");
    await expect(page.getByTestId("section-runtime")).toContainText("OpenRouter");
    await expect(page.getByTestId("section-channels")).toContainText("Briar");
    await expect(page.getByTestId("section-channels")).toContainText("WhatsApp");
    await expect(page.getByTestId("section-channels")).toContainText("Token monitoring");
    await expect(page.getByTestId("section-channels")).toContainText("Desktop MCQ");
    await expect(page.getByTestId("section-channels")).toContainText("CI publish checks");
    await expect(page.getByTestId("section-cases")).toContainText("Case studies");
    await expect(page.locator("#case-grid .case-card")).toHaveCount(10);
    await expect(page.getByTestId("section-measure")).toContainText("Measurement kit");
    await expect(page.getByTestId("section-starters")).toContainText("Starter kit");
    await expect(page.locator("#starter-list .starter-card")).toHaveCount(6);
    await expect(page.locator("#starter-list .starter-body").first()).toContainText("Example domain task");
  });

  test("explore tabs switch panels including glossary", async ({ page }) => {
    await page.goto("/#explore");
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    await expect(page.getByTestId("panel-timeline")).toBeVisible();
    await page.getByRole("tab", { name: "Stack" }).click();
    await expect(page.getByTestId("panel-stack")).toBeVisible();
    await expect(page.getByTestId("panel-timeline")).toBeHidden();
    await expect(page.getByTestId("panel-stack")).toContainText("Skills");
    await page.getByRole("tab", { name: "Capability" }).click();
    await expect(page.getByTestId("panel-capability")).toContainText("Before AI");
    await page.getByRole("tab", { name: "Patterns" }).click();
    await expect(page.getByTestId("panel-patterns")).toContainText("Lean tool sessions");
    await page.getByRole("tab", { name: "Glossary" }).click();
    await expect(page.getByTestId("panel-glossary")).toContainText("Harness");
    await expect(page.getByTestId("panel-glossary")).toContainText("MemPalace");
    await expect(page.getByTestId("panel-glossary")).toContainText("TWP");
    await expect(page.getByTestId("panel-glossary")).toContainText("Preloop");
    await expect(page.getByTestId("panel-glossary")).toContainText("OpenRouter");
    await expect(page.getByTestId("panel-glossary")).toContainText("Briar");
    await expect(page.getByTestId("panel-glossary")).toContainText("Token lean");
    await expect(page.getByTestId("panel-glossary")).toContainText("FAQ");
    await page.getByRole("tab", { name: "Research" }).click();
    await expect(page.getByTestId("panel-literature")).toContainText("METR");
  });

  test("about section is present", async ({ page }) => {
    await page.goto("/#privacy");
    await expect(page.getByTestId("section-privacy")).toContainText("About this notebook");
  });

  test("SEO metadata and social cards are present", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Durable Agent Harness/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /durable AI agent harness/i,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dynamicdevices.github.io/durable-agent-harness/",
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /assets\/og-cover\.png$/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    const ld = await page.locator('script[type="application/ld+json"]').textContent();
    expect(ld).toContain("TechArticle");
    expect(ld).toContain("Active-ESL");
    expect(ld).toContain("Active Edge Solutions Limited");
  });
});

