import { test, expect } from '@playwright/test';

test('Spanish skips the English dictionary and the last choice wins during loading', async ({ page }) => {
  const dictionaries: string[] = [];
  page.on('request', request => {
    if (/\/translations\.[^/]+\.js/.test(request.url())) dictionaries.push(request.url());
  });
  let release!: () => void;
  const blocked = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/_astro/translations.*.js', async route => {
    await blocked;
    await route.continue();
  });
  await page.goto('/?lang=es');
  await expect(page.locator('h1')).toContainText('Software a medida');
  expect(dictionaries).toHaveLength(0);
  const english = page.locator('[data-language-option="en"]');
  await english.click();
  await expect(english).toHaveAttribute('aria-busy', 'true');
  await page.locator('[data-language-option="es"]').click();
  expect(await page.evaluate(() => localStorage.getItem('bsoftware-language'))).toBe('es');
  release();
  await page.waitForLoadState('networkidle');
  await expect(english).not.toHaveAttribute('aria-busy');
  await expect(page.locator('h1')).toHaveText('Software a medida para trabajar mejor.');
  await english.click();
  await expect(page.locator('h1')).toHaveText('Custom software to work better.');
  await page.locator('[data-language-option="es"]').click();
  await expect(page.locator('h1')).toHaveText('Software a medida para trabajar mejor.');
});

test('an unavailable dictionary leaves the original page usable', async ({ page }) => {
  await page.route('**/_astro/translations.*.js', route => route.abort());
  await page.goto('/?lang=en');
  await expect(page.locator('html')).toHaveAttribute('data-language', 'es');
  await expect(page.locator('h1')).toHaveText('Software a medida para trabajar mejor.');
  await expect(page.locator('[data-language-option="es"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-language-option="en"]')).not.toHaveAttribute('aria-busy');
});
