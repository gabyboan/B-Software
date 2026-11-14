import { test, expect } from '@playwright/test';

test('structured breadcrumbs describe real internal paths and professional identity', async ({ page }) => {
  for (const path of ['/', '/sobre-b-software/', '/proyectos/gestion-recursos-humanos/', '/proyectos/nido-inmobiliaria/']) {
    await page.goto(path);
    const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(node => {
      const value = JSON.parse(node.textContent || '{}');
      return value['@graph'] || [value];
    }));
    const breadcrumbs = schemas.filter(value => value['@type'] === 'BreadcrumbList');
    expect(breadcrumbs).toHaveLength(path === '/' ? 0 : 1);
    for (const trail of breadcrumbs) {
      expect(trail.itemListElement.length).toBeGreaterThanOrEqual(2);
      trail.itemListElement.forEach((item: { position: number; item: string }, index: number) => {
        expect(item.position).toBe(index + 1);
        expect(item.item).toMatch(/^https:\/\/bsoftware\.pages\.dev\//);
      });
    }
    await expect(page.locator('footer a[href="https://www.linkedin.com/in/gabyboan/"]')).toBeVisible();
  }
});

test('first visit preserves server language and mobile controls fit small screens', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'en-US' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-language', 'es');
  await expect(page.locator('h1')).toContainText('Software a medida');
  for (const width of [320, 360, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    for (const selector of ['.language-option', '.technology-tabs button', '.footer-contact a', '.footer-legal a']) {
      const sizes = await page.locator(selector).evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height));
      expect(sizes.length).toBeGreaterThan(0);
      expect(Math.min(...sizes)).toBeGreaterThanOrEqual(44);
    }
  }
  await page.locator('[data-language-option="en"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-language', 'en');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-language', 'en');
  await context.close();
});
