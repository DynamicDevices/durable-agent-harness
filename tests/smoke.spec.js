const { test, expect } = require("@playwright/test");

test.describe("Durable Agent Harness site", () => {
  test("hero brands first and primary CTA works", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("brand")).toBeVisible();
    await expect(page.getByTestId("hero")).toContainText("Durable Agent Harness");
    const brand = page.locator(".hero-brand");
    await expect(brand).toBeVisible();
    // Brand signal should be larger than the supporting headline.
    const brandSize = await brand.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    const h1Size = await page.locator(".hero h1").evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(brandSize).toBeGreaterThan(h1Size);

    await page.getByTestId("cta-explore").click();
    await expect(page.getByTestId("section-explore")).toBeInViewport();
  });

  test("clocks and stats render from content", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("clock-serious_ai")).toBeVisible();
    await expect(page.getByTestId("clock-cursor")).toBeVisible();
    await expect(page.getByTestId("clock-harness")).toBeVisible();
    await expect(page.getByTestId("stat-strip")).toContainText("Agent skills");
    await expect(page.getByTestId("stat-strip")).toContainText("69");
  });

  test("explore tabs switch panels", async ({ page }) => {
    await page.goto("/#explore");
    await expect(page.getByTestId("panel-timeline")).toBeVisible();
    await page.getByRole("tab", { name: "Stack" }).click();
    await expect(page.getByTestId("panel-stack")).toBeVisible();
    await expect(page.getByTestId("panel-timeline")).toBeHidden();
    await expect(page.getByTestId("panel-stack")).toContainText("Skills");
    await page.getByRole("tab", { name: "Capability" }).click();
    await expect(page.getByTestId("panel-capability")).toContainText("Before AI");
    await page.getByRole("tab", { name: "Patterns" }).click();
    await expect(page.getByTestId("panel-patterns")).toContainText("Lean tool sessions");
    await page.getByRole("tab", { name: "Research" }).click();
    await expect(page.getByTestId("panel-literature")).toContainText("METR");
  });

  test("privacy section is present", async ({ page }) => {
    await page.goto("/#privacy");
    await expect(page.getByTestId("section-privacy")).toContainText("Public means redacted");
  });
});
