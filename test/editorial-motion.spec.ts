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
