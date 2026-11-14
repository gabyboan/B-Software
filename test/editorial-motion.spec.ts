import { test, expect } from '@playwright/test';

test('reading progress follows scrolling and reduced motion cancels editorial entrances', async ({ page }) => {
  await page.goto('/?lang=es');
  const progress = page.locator('[data-reading-progress]');
  await expect(progress).toHaveAttribute('aria-hidden', 'true');
  await expect.poll(() => progress.evaluate(el => Number((el as HTMLElement).style.getPropertyValue('--reading-progress')))).toBe(0);
  await page.locator('#servicios').scrollIntoViewIfNeeded();
  await expect.poll(() => progress.evaluate(el => Number((el as HTMLElement).style.getPropertyValue('--reading-progress')))).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter(animation => {
    const target = (animation.effect as KeyframeEffect | null)?.target;
    return target instanceof Element && target.matches('.hero-copy > *, .hero-system, .home-heading, .services-list > article');
  }).length)).toBe(0);
  await expect(page.locator('#services-title')).toBeVisible();
});

test('reading progress stays accurate after viewport height and language changes', async ({ page }) => {
  await page.goto('/?lang=es');
  await page.locator('#servicios').scrollIntoViewIfNeeded();
  const viewport = page.viewportSize()!;
  await page.setViewportSize({ width: viewport.width, height: viewport.height - 100 });
  const accurate = () => page.evaluate(() => {
    const actual = Number((document.querySelector('[data-reading-progress]') as HTMLElement).style.getPropertyValue('--reading-progress'));
    const range = document.documentElement.scrollHeight - innerHeight;
    const expected = range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0;
    return Math.abs(actual - expected);
  });
  await expect.poll(accurate).toBeLessThan(.002);
  const position = await page.evaluate(() => scrollY);
  await page.locator('[data-language-option="en"]').click();
  await expect(page.locator('#services-title')).toContainText('Services');
  await expect.poll(accurate).toBeLessThan(.002);
  expect(Math.abs(await page.evaluate(() => scrollY) - position)).toBeLessThan(3);
  await page.locator('[data-language-option="es"]').click();
  await expect(page.locator('#services-title')).toContainText('Servicios');
  await expect.poll(accurate).toBeLessThan(.002);
});
