const { test, expect } = require("@playwright/test");

test.describe("Durable Agent Harness site", () => {
  test("hero brands first and primary CTA works", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true", { timeout: 20000 });
    await expect(page.getByTestId("brand")).toBeVisible();
    const mark = page.locator(".brand img");
    await expect(mark).toHaveAttribute("src", /chopwood-mark\.png$/);
    await expect(mark).toHaveJSProperty("naturalWidth", await mark.evaluate((el) => el.naturalWidth));
    expect(await mark.evaluate((el) => el.naturalWidth)).toBeGreaterThan(0);
    await expect(page.getByTestId("hero")).toContainText("Chop Wood Carry Water");
    await expect(page.getByTestId("hero")).toContainText("Durable Agent Harness");
    await expect(page.getByTestId("hero-byline")).toContainText("Brought to you by Alex Lennon");
    await expect(page.getByTestId("hero-byline")).toContainText("@embedded_iot");
    await expect(page.getByTestId("hero-byline").locator("a.hero-handle")).toHaveAttribute(
      "href",
      "https://x.com/embedded_iot",
    );
    await expect(page.getByTestId("hero-agents")).toContainText("Agents: start here");
    await expect(page.getByTestId("hero-agents").locator("a")).toHaveAttribute(
      "href",
      "agents.html",
    );
    const brand = page.locator(".hero-brand");
    const brandSize = await brand.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    const h1Size = await page.locator(".hero h1").evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(brandSize).toBeGreaterThan(h1Size);
    await expect(brand).toHaveText("Chop Wood Carry Water");

    await page.getByTestId("cta-start").click();
    await expect(page.getByTestId("section-hour")).toBeInViewport();
  });

  test("agents get-going page links to pack and hour path", async ({ page }) => {
    await page.goto("/agents.html");
    await expect(page.getByTestId("page-agents")).toContainText("Get going");
    await expect(page.getByTestId("agents-pack")).toHaveAttribute(
      "href",
      /cursor-hour-starter\.zip$/,
    );
    await expect(page.getByTestId("agents-hour")).toHaveAttribute("href", "./#hour");
    await expect(page.getByTestId("agents-steps").locator(".step-card")).toHaveCount(6);
  });

  test("section Zen epigraphs render", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    await expect(page.getByTestId("epigraph-hour")).toContainText("chop wood, carry water");
    await expect(page.getByTestId("epigraph-start")).toContainText("After enlightenment");
    await expect(page.getByTestId("epigraph-learning")).toContainText("Not knowing");
    await expect(page.getByTestId("epigraph-blog")).toBeVisible();
  });

  test("60-minute starter and pack links render", async ({ page }) => {
    await page.goto("/#hour");
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    await expect(page.getByTestId("section-hour")).toContainText("Start in 60 minutes");
    await expect(page.getByTestId("hour-steps").locator(".step-card")).toHaveCount(8);
    await expect(page.getByTestId("hour-done")).toContainText("Done when");
    const download = page.getByTestId("hour-download");
    await expect(download).toHaveAttribute("href", /cursor-hour-starter\.zip$/);
    const res = await page.request.get("/packs/cursor-hour-starter.zip");
    expect(res.ok()).toBeTruthy();
    await expect(page.getByTestId("hour-browse")).toHaveAttribute(
      "href",
      /packs\/cursor-hour\/README\.md$/,
    );
  });

  test("start paths and clocks render", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    await expect(page.getByTestId("section-start")).toContainText("60 minutes");
    await expect(page.getByTestId("section-start")).toContainText("Playbook");
    await expect(page.getByTestId("section-start")).toContainText("Blog");
    await expect(page.getByTestId("section-start")).toContainText("Kaizen → Toyota Way Practices");
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
    await expect(page.getByTestId("section-runtime")).toContainText("PR / commit checks");
    await expect(page.getByTestId("runtime-pr-steps").locator(".step-card")).toHaveCount(4);
    await expect(page.getByTestId("section-runtime")).toContainText("commit status");
    await expect(page.getByTestId("section-channels")).toContainText("Briar");
    await expect(page.getByTestId("section-channels")).toContainText("WhatsApp");
    await expect(page.getByTestId("section-channels")).toContainText("Token monitoring");
    await expect(page.getByTestId("section-channels")).toContainText("Desktop MCQ");
    await expect(page.getByTestId("section-channels")).toContainText("CI publish checks");
    await expect(page.getByTestId("section-cases")).toContainText("Case studies");
    await expect(page.locator("#case-grid .case-card")).toHaveCount(10);
    await expect(page.getByTestId("section-measure")).toContainText("Measurement kit");
    await expect(page.getByTestId("section-measure")).toContainText("EOW");
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
    await expect(page.getByTestId("panel-patterns")).toContainText("Preloop before expensive CI");
    await expect(page.getByTestId("panel-patterns")).toContainText("Notebook updates at EOW");
    await page.getByRole("tab", { name: "Glossary" }).click();
    await expect(page.getByTestId("panel-glossary")).toContainText("Harness");
    await expect(page.getByTestId("panel-glossary")).toContainText("MemPalace");
    await expect(page.getByTestId("panel-glossary")).toContainText("Toyota Way Practices");
    await expect(page.getByTestId("panel-glossary")).toContainText("Preloop");
    await expect(page.getByTestId("panel-glossary")).toContainText("OpenRouter");
    await expect(page.getByTestId("panel-glossary")).toContainText("Preloop commit status");
    await expect(page.getByTestId("panel-glossary")).toContainText("Briar");
    await expect(page.getByTestId("panel-glossary")).toContainText("Token lean");
    await expect(page.getByTestId("panel-glossary")).toContainText("FAQ");
    await page.getByRole("tab", { name: "Research" }).click();
    await expect(page.getByTestId("panel-literature")).toContainText("METR");
  });

  test("about section is present", async ({ page }) => {
    await page.goto("/#privacy");
    await expect(page.getByTestId("section-privacy")).toContainText("Alex Lennon");
    await expect(page.getByTestId("section-privacy")).toContainText("@embedded_iot");
    await expect(page.getByTestId("about-baseline")).toContainText("v1.0.0");
    await expect(page.getByTestId("section-privacy")).not.toContainText("Active-ESL");
  });

  test("blog posts render in first person", async ({ page }) => {
    await page.goto("/#blog");
    await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
    await expect(page.getByTestId("section-blog")).toContainText("Blog");
    await expect(page.getByTestId("section-blog")).toContainText("What broke");
    await expect(page.getByTestId("section-blog")).not.toContainText("Not a content calendar");
    await expect(page.getByTestId("blog-v1-baseline")).toContainText("v1.0");
    await expect(page.getByTestId("blog-notebook-at-eow")).toContainText("EOW");
    await expect(page.getByTestId("blog-start-in-60-minutes")).toContainText("60 minutes");
    await expect(page.getByTestId("blog-preloop-openrouter-pr-checks")).toContainText(
      "PR commits",
    );
    await expect(page.getByTestId("blog-chop-wood-carry-water")).toContainText(
      "chopwoodcarrywater.uk",
    );
    await expect(page.getByTestId("blog-context-is-rent")).toContainText("Context is rent");
    await expect(page.getByTestId("blog-standard-work-not-lore")).toContainText(
      "Standard work, not lore",
    );
  });

  test("SEO metadata and social cards are present", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Durable Agent Harness/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /working relationship with AI coding agents/i,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://chopwoodcarrywater.uk/",
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /assets\/og-cover\.jpe?g$/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    const ld = await page.locator('script[type="application/ld+json"]').textContent();
    expect(ld).toContain("TechArticle");
    expect(ld).toContain("Chop Wood Carry Water");
    expect(ld).toContain("Alex Lennon");
    expect(ld).toContain("embedded_iot");
    expect(ld).not.toContain("Active-ESL");
  });
});

