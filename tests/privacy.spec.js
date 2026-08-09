const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const DEFAULT_DENY =
  process.env.DENYLIST_FILE ||
  "/home/ajlennon/data_drive/dd/personal/ai-tenure/public-site-denylist.txt";

function loadRules() {
  if (!fs.existsSync(DEFAULT_DENY)) return [];
  return fs
    .readFileSync(DEFAULT_DENY, "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((line) => {
      const kind = line.slice(0, line.indexOf(":"));
      const pattern = line.slice(line.indexOf(":") + 1);
      return { kind, pattern };
    });
}

test("rendered page text contains no denylisted personal/ops material", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toHaveAttribute("data-ready", "true", { timeout: 20000 });
  await page.getByRole("tab", { name: "Capability" }).click();
  await page.getByRole("tab", { name: "Glossary" }).click();
  await page.getByRole("tab", { name: "Research" }).click();
  await page.locator("#cases").scrollIntoViewIfNeeded();
  await page.locator("#starters").scrollIntoViewIfNeeded();
  const text = (await page.locator("body").innerText()).toLowerCase();
  const html = (await page.content()).toLowerCase();
  const blob = `${text}\n${html}`;

  // Generic gates always.
  expect(blob).not.toMatch(/\b447\d{9}\b/);
  expect(blob).not.toMatch(/\b192\.168\.\d+\.\d+\b/);

  const rules = loadRules();
  test.info().annotations.push({
    type: "denylist",
    description: rules.length ? `private denylist (${rules.length} rules)` : "generic only",
  });

  for (const rule of rules) {
    if (rule.kind === "plain") {
      expect(blob, `denylist plain hit: ${rule.pattern}`).not.toContain(rule.pattern.toLowerCase());
    } else if (rule.kind === "re") {
      const re = new RegExp(rule.pattern, "i");
      expect(re.test(blob), `denylist re hit: ${rule.pattern}`).toBeFalsy();
    }
  }
});
