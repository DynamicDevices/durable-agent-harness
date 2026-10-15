const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const axePath = require.resolve('axe-core/axe.min.js');

test('three starting points work with keyboard and preserve reference destinations', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  const starts = page.locator('#start-here');
  const links = starts.locator('.path-card');
  await expect(links).toHaveCount(3);
  const targets = ['worked-example.html', '#hour', '#blog'];
  for (let i = 0; i < targets.length; i++) {
    await expect(links.nth(i)).toHaveAttribute('href', targets[i]);
  }
  // Tab through the actual links; Enter must navigate to the exercise.
  await links.nth(0).focus();
  await page.keyboard.press('Tab');
  await expect(links.nth(1)).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(links.nth(2)).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(links.nth(0)).toBeFocused();
  await links.nth(0).scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath('starting-points.png') });
  for (const id of ['hour', 'codex', 'playbook', 'starters', 'learning', 'runtime', 'channels', 'explore', 'measure', 'blog']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  await page.keyboard.press('Enter');
  // The local static server redirects .html to an extensionless URL.
  await expect(page).toHaveURL(/\/worked-example(?:\.html)?$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const sample = page.getByRole('region', { name: 'Exercise commands' });
  await page.getByRole('link', { name: 'Verify the download', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(sample).toBeFocused();
  const focus = await sample.evaluate(el => ({ visible: el.matches(':focus-visible'), width: parseFloat(getComputedStyle(el).outlineWidth) }));
  expect(focus.visible).toBe(true);
  expect(focus.width).toBeGreaterThanOrEqual(3);
  await page.keyboard.press('Tab');
  await expect(sample).not.toBeFocused();
});

for (const file of ['worked-example.html', 'downloads.html', 'feedback.html']) {
  test(`${file} is readable, linked and accessible`, async ({ page, request }, testInfo) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/${file}`);
    await expect(page.locator('main h1')).toHaveCount(1);
    const brand = page.locator('.brand img');
    expect(await brand.evaluate(el => el.naturalWidth)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const href of new Set(await page.locator('main a[href]').evaluateAll(links => links.map(a => a.getAttribute('href'))))) {
      if (/^https?:/.test(href)) continue; // Local candidate checks need no external traffic.
      const url = new URL(href, page.url());
      expect((await request.get(url.pathname)).ok(), href).toBe(true);
      if (url.hash && url.pathname.endsWith('.html') && url.pathname === `/${file}`) {
        await expect(page.locator(url.hash)).toHaveCount(1);
      }
    }
    await page.addScriptTag({ path: axePath });
    const result = await page.evaluate(async () => {
      const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } });
      return { violations: r.violations, passes: r.passes.length, incomplete: r.incomplete.length };
    });
    fs.writeFileSync(testInfo.outputPath('axe.json'), JSON.stringify(result, null, 2));
    await page.screenshot({ path: testInfo.outputPath(file.replace('.html', '.png')), fullPage: true });
    expect(result.violations).toEqual([]);
    expect(errors).toEqual([]);
    if (file === 'worked-example.html') {
      const downloadEvent = page.waitForEvent('download');
      await page.getByRole('link', { name: 'Download the exercise ZIP', exact: true }).click();
      const download = await downloadEvent;
      expect(download.suggestedFilename()).toBe('worked-example.zip');
      await download.saveAs(testInfo.outputPath('worked-example.zip'));
      expect(fs.readFileSync(testInfo.outputPath('worked-example.zip'))).toEqual(fs.readFileSync(path.join(__dirname, '../docs/packs/worked-example.zip')));
    }
    if (file === 'feedback.html') {
      await expect(page.locator('form, input, textarea')).toHaveCount(0);
      await expect(page.getByRole('link', { name: 'existing repository issue route' })).toHaveAttribute('href', 'https://github.com/DynamicDevices/durable-agent-harness/issues');
    }
  });
}
