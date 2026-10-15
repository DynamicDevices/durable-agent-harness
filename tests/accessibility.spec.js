const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const axePath = require.resolve('axe-core/axe.min.js');

test('starter samples support keyboard focus, visible focus and scrolling', async ({ page }, testInfo) => {
  await page.goto('/#starters');
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  const cards = page.locator('.starter-card');
  await expect(cards).toHaveCount(6);
  let scrolled = 0;
  for (let i = 0; i < await cards.count(); i++) {
    const card = cards.nth(i);
    const sample = card.getByRole('region');
    await expect(sample).toHaveAccessibleName(/code sample$/);
    // Start at the preceding copy button and enter the sample using Tab.
    await card.getByRole('button', { name: 'Copy', exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(sample).toBeFocused();
    const focus = await sample.evaluate(el => ({
      visible: el.matches(':focus-visible'),
      width: parseFloat(getComputedStyle(el).outlineWidth),
      style: getComputedStyle(el).outlineStyle,
      scrollable: el.scrollHeight > el.clientHeight,
    }));
    expect(focus.visible).toBe(true);
    expect(focus.width).toBeGreaterThanOrEqual(3);
    expect(focus.style).toBe('solid');
    if (focus.scrollable) {
      await page.keyboard.press('Control+End');
      await expect.poll(() => sample.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
      scrolled++;
    }
    if (i === 0) {
      await sample.scrollIntoViewIfNeeded();
      await expect(sample).toBeInViewport();
      await expect(sample).toBeFocused();
      await page.screenshot({ path: testInfo.outputPath('keyboard.png') });
    }
    await page.keyboard.press('Tab');
    await expect(sample).not.toBeFocused();
  }
  expect(scrolled).toBeGreaterThan(0);
});

test('mobile contents opens with keyboard and reaches a destination without overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile navigation');
  await page.goto('/');
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  const summary = page.locator('.mobile-contents summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  const nav = page.getByRole('navigation', { name: 'Mobile contents' });
  await expect(nav).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(nav.getByRole('link', { name: '60 min', exact: true })).toBeFocused();
  await page.screenshot({ path: testInfo.outputPath('mobile-contents.png') });
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#hour$/);
  await expect(page.getByTestId('section-hour')).toBeInViewport();
  await expect(nav).not.toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  // The same native control also works by touch.
  await summary.tap();
  await expect(nav).toBeVisible();
  await nav.getByRole('link', { name: 'Starters', exact: true }).tap();
  await expect(page).toHaveURL(/#starters$/);
  await expect(nav).not.toBeVisible();
});

test('homepage axe WCAG A/AA scan', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  // Include the expanded mobile contents in the mobile scan.
  if (testInfo.project.name === 'mobile') await page.locator('.mobile-contents summary').click();
  await page.addScriptTag({ path: axePath });
  const result = await page.evaluate(async () => {
    const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } });
    return { violations: r.violations, passes: r.passes.length, incomplete: r.incomplete.length };
  });
  fs.writeFileSync(testInfo.outputPath('axe.json'), JSON.stringify(result, null, 2));
  expect(result.violations).toEqual([]);
});
