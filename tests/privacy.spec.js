const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const DENY = path.join(__dirname, "..", "content", "denylist.txt");

function loadRules() {
  return fs
    .readFileSync(DENY, "utf8")
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
  await page.getByRole("tab", { name: "Capability" }).click();
  await page.getByRole("tab", { name: "Research" }).click();
  const text = (await page.locator("body").innerText()).toLowerCase();
  const html = (await page.content()).toLowerCase();
  const blob = `${text}\n${html}`;

  for (const rule of loadRules()) {
    if (rule.kind === "plain") {
      expect(blob, `denylist plain hit: ${rule.pattern}`).not.toContain(rule.pattern.toLowerCase());
    } else if (rule.kind === "re") {
      const re = new RegExp(rule.pattern, "i");
      expect(re.test(blob), `denylist re hit: ${rule.pattern}`).toBeFalsy();
    }
  }
});
