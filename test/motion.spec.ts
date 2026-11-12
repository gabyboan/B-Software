import { test, expect, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function openCalendar(page: import('@playwright/test').Page) {
  await page.goto('/?lang=es');
  const root = page.locator('.case-motion');
  await root.scrollIntoViewIfNeeded();
  await expect(root).toHaveClass(/motion-ready/);
  return root;
}

async function turn(root: Locator, page: number) {
  await root.evaluate((element, progress) => {
    const travel = parseFloat((element as HTMLElement).style.getPropertyValue('--calendar-travel')) / 2;
    window.scrollTo({ top: scrollY + element.getBoundingClientRect().top - 96 + travel * progress, behavior: 'instant' });
  }, page);
}

test('calendar turns real project sheets, reverses, and keeps only the active project interactive', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Desktop sheets need room for the whole project.');
  // Match the usable browser height in the reference screenshot.
  await page.setViewportSize({ width: 1440, height: 780 });
  const root = await openCalendar(page);
  await expect(root).toHaveClass(/calendar-enabled/);
  const cards = root.locator('.case-list > article');
  await turn(root, 0);
  await expect(cards.nth(0)).not.toHaveAttribute('inert', '');
  await expect(cards.nth(1)).toHaveAttribute('inert', '');
  const box = await cards.nth(0).boundingBox();
  expect(box!.y + box!.height).toBeLessThan(780);
  await turn(root, .4);
  await expect.poll(() => cards.nth(0).evaluate(card => Math.abs(new DOMMatrix(getComputedStyle(card).transform).m23))).toBeGreaterThan(.3);
  await expect(cards.nth(0)).toHaveAttribute('inert', '');
  await turn(root, 1);
  await expect(root.getByRole('button', { name: '02 Tiago Market' })).toHaveAttribute('aria-pressed', 'true');
  await expect(cards.nth(0)).toHaveAttribute('aria-hidden', 'true');
  await expect(cards.nth(1)).not.toHaveAttribute('inert', '');
  const beforeFocus = await page.evaluate(() => scrollY);
  await cards.nth(1).locator('.case-link').focus();
  expect(await page.evaluate(() => scrollY)).toBe(beforeFocus);
  const axe = await new AxeBuilder({ page }).include('.case-motion').withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, reason: n.failureSummary })) }))).toEqual([]);
  await root.getByRole('button', { name: 'Proyecto siguiente' }).click();
  await expect(root.getByRole('button', { name: '03 Nido' })).toHaveAttribute('aria-pressed', 'true');
  await root.getByRole('button', { name: 'Proyecto anterior' }).focus();
  await page.keyboard.press('Enter');
  await expect(root.getByRole('button', { name: '02 Tiago Market' })).toHaveAttribute('aria-pressed', 'true');
  await cards.nth(1).getByRole('link', { name: 'Ver decisiones del producto' }).click();
  await expect(page).toHaveURL(/comparador-geolocalizado-de-precios/);
});

test('RRHH diagram keeps mouse, keyboard and language changes working', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const root = await openCalendar(page);
  if (await root.evaluate(element => element.classList.contains('calendar-enabled'))) await turn(root, 0);
  const map = page.locator('.architecture-map');
  await map.getByRole('button', { name: 'Android App Suplencias' }).click();
  await expect(map.getByRole('status')).toContainText('Suplencias y vistas por jefatura');
  await map.getByRole('button', { name: 'Portal Consulta Horas' }).focus();
  await page.keyboard.press('Enter');
  await expect(map.getByRole('status')).toContainText('solo lectura');
  await page.locator('[data-language-option="en"]').click();
  await expect(map.getByRole('status')).toContainText('read-only');
  await page.locator('[data-language-option="es"]').click();
  await expect(map.getByRole('status')).toContainText('solo lectura');
  await page.locator('.rrhh-card .case-link').click();
  await expect(page).toHaveURL(/gestion-recursos-humanos/);
  expect(errors).toEqual([]);
});

test('small screens and reduced motion preserve the complete reading order', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  const root = await openCalendar(page);
  await expect(root).not.toHaveClass(/calendar-enabled/);
  for (const card of await root.locator('.case-list > article').all()) {
    await card.locator('.case-link').scrollIntoViewIfNeeded();
    await expect(card.locator('.case-link')).toBeInViewport();
    await expect(card).not.toHaveAttribute('inert', '');
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(root).not.toHaveClass(/calendar-enabled/);
  expect(await page.locator('.architecture-canvas path').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await expect(root.locator('.case-list > article')).toHaveCount(3);
});

test('mechanical metric flaps rotate, settle to published values and do not replay', async ({ page }) => {
  await page.goto('/?lang=es');
  const metrics = page.locator('#metricas');
  await expect(metrics).toHaveAttribute('data-state', 'ready');
  await metrics.locator('.numbers-grid').scrollIntoViewIfNeeded();
  await expect(metrics).toHaveAttribute('data-state', 'playing');
  await expect.poll(() => metrics.locator('.flip-leaf').evaluateAll(leaves => leaves.some(leaf => {
    const matrix = new DOMMatrix(getComputedStyle(leaf).transform);
    return Math.abs(matrix.m23) > .05 && Math.abs(matrix.m23) < .99;
  })), { intervals: [10, 20, 30] }).toBe(true);
  await expect(metrics).toHaveAttribute('data-state', 'done');
  expect(await metrics.locator('[data-base-top]').allTextContents()).toEqual(['4', '3', '7', '4']);
  expect(await metrics.locator('[data-base-bottom]').allTextContents()).toEqual(['4', '3', '7', '4']);
  expect(await metrics.locator('.metric-readable').allTextContents()).toEqual(['4', '3', '7', '4']);
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await metrics.scrollIntoViewIfNeeded();
  await expect(metrics).toHaveAttribute('data-state', 'done');
  expect(await metrics.evaluate(section => section.getAnimations({ subtree: true }).length)).toBe(0);
});

test('resizing during the clock animation safely settles every digit', async ({ page }) => {
  await page.goto('/?lang=es');
  const metrics = page.locator('#metricas');
  await metrics.locator('.numbers-grid').scrollIntoViewIfNeeded();
  await expect(metrics).toHaveAttribute('data-state', 'playing');
  await page.setViewportSize({ width: 1024, height: 800 });
  await expect(metrics).toHaveAttribute('data-state', 'done');
  expect(await metrics.locator('[data-base-bottom]').allTextContents()).toEqual(['4', '3', '7', '4']);
  expect(await metrics.evaluate(section => section.getAnimations({ subtree: true }).length)).toBe(0);
});

test('without JavaScript projects and final metrics remain available', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL + '/');
  await expect(page.locator('.calendar-controls')).toBeHidden();
  await expect(page.locator('.case-list .case-link')).toHaveCount(3);
  for (const link of await page.locator('.case-list .case-link').all()) await expect(link).toBeVisible();
  expect(await page.locator('[data-base-top]').allTextContents()).toEqual(['4', '3', '7', '4']);
  await context.close();
});

test('reduced motion renders final clock values immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=es');
  const metrics = page.locator('#metricas');
  await expect(metrics).toHaveAttribute('data-state', 'done');
  await metrics.scrollIntoViewIfNeeded();
  expect(await metrics.locator('[data-base-top]').allTextContents()).toEqual(['4', '3', '7', '4']);
  expect(await metrics.evaluate(section => section.getAnimations({ subtree: true }).length)).toBe(0);
});
