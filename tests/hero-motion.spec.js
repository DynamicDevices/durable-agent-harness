const { test, expect } = require('@playwright/test');

test('river plays silently and manual pause survives leaving the hero', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const video = page.locator('.hero-video');
  await expect(video).toHaveClass(/is-playing/);
  expect(await video.evaluate(v => v.muted && v.loop && v.playsInline)).toBe(true);
  await page.getByRole('button', { name: 'Pause background animation' }).click();
  await expect.poll(() => video.evaluate(v => v.paused)).toBe(true);
  await page.locator('#blog').scrollIntoViewIfNeeded();
  await page.locator('#top').scrollIntoViewIfNeeded();
  await expect(video).toHaveJSProperty('paused', true);
  await page.getByRole('button', { name: 'Play background animation' }).focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => video.evaluate(v => v.paused)).toBe(false);
  await page.locator('#blog').scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate(v => v.paused)).toBe(true);
  await page.locator('#top').scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate(v => v.paused)).toBe(false);
});

test('reduced motion shows the photograph without requesting the video', async ({ page }) => {
  const requests = [];
  page.on('request', r => { if (r.url().endsWith('.mp4')) requests.push(r.url()); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.hero-photo')).toBeVisible();
  await expect(page.locator('.hero-video')).not.toHaveAttribute('src');
  await expect(page.locator('.hero-motion')).toBeHidden();
  expect(requests).toEqual([]);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.hero-video')).toHaveClass(/is-playing/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.hero-video')).toHaveJSProperty('paused', true);
  await expect(page.locator('.hero-video')).toBeHidden();
});

test('media failure keeps the photograph and navigation usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.route('**/chopwood-hero-loop.mp4', r => r.abort());
  await page.goto('/');
  await expect.poll(() => page.locator('.hero-video').evaluate(v => v.error?.code)).toBeTruthy();
  await expect(page.locator('.hero-motion')).toBeHidden();
  await expect(page.locator('.hero-photo')).toBeVisible();
  await expect(page.locator('.hero-video')).not.toHaveClass(/is-playing/);
  await page.getByTestId('cta-start').click();
  await expect(page).toHaveURL(/#hour$/);
});

test('a preference change during pending playback resumes without a user pause', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const original = HTMLMediaElement.prototype.play;
    let first = true;
    HTMLMediaElement.prototype.play = function () {
      if (!first) return original.call(this);
      first = false;
      return new Promise((_, reject) => {
        window.rejectFirstPlay = () => reject(new DOMException('Interrupted', 'AbortError'));
      });
    };
  });
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => typeof window.rejectFirstPlay)).toBe('function');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.hero-motion')).toBeHidden();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.hero-motion')).toBeVisible();
  await page.evaluate(() => window.rejectFirstPlay());
  await expect(page.locator('.hero-video')).toHaveClass(/is-playing/);
  await expect(page.locator('.hero-video')).toHaveJSProperty('paused', false);
});

test('no JavaScript leaves the static hero and no media request', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const media = [];
  page.on('request', r => { if (r.url().endsWith('.mp4')) media.push(r.url()); });
  await page.goto('/');
  await expect(page.locator('.hero-photo')).toBeVisible();
  await expect(page.locator('.hero-motion')).toBeHidden();
  expect(media).toEqual([]);
  await context.close();
});
