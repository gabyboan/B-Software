import { test, expect } from '@playwright/test';

test('RRHH architecture hydrates and exposes each product with working case links', async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?lang=es');
  const map = page.locator('.architecture-map');
  await map.scrollIntoViewIfNeeded();
  await expect(page.locator('.case-motion')).toHaveClass(/motion-ready/);
  if (isMobile) {
    await expect(page.locator('.case-stacks')).toHaveCount(0);
  } else {
    await expect(page.locator('.rrhh-card')).toHaveClass(/case-stacks/);
    await page.locator('.rrhh-card').evaluate(card => window.scrollTo(0, window.scrollY + card.getBoundingClientRect().top - 104 + 40));
    await expect.poll(() => page.locator('.rrhh-card').evaluate(card => Math.round(card.getBoundingClientRect().top))).toBe(104);
  }
  await map.getByRole('button', { name: 'Android App Suplencias' }).click();
  await expect(map.getByRole('button', { name: 'Android App Suplencias' })).toHaveAttribute('aria-pressed', 'true');
  await expect(map.getByRole('status')).toContainText('Suplencias y vistas por jefatura');
  await map.getByRole('button', { name: 'Portal Consulta Horas' }).focus();
  await page.keyboard.press('Enter');
  await expect(map.getByRole('status')).toContainText('solo lectura');
  await page.locator('.rrhh-card .case-link').click();
  await expect(page).toHaveURL(/gestion-recursos-humanos/);
  expect(errors).toEqual([]);
});

test('reduced motion preserves all cases without sticky or animated connections', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=es');
  await page.locator('.case-motion').scrollIntoViewIfNeeded();
  await expect(page.locator('.case-motion')).toHaveClass(/motion-ready/);
  await expect(page.locator('.case-stacks')).toHaveCount(0);
  expect(await page.locator('.architecture-canvas path').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await expect(page.locator('.case-list > article')).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
