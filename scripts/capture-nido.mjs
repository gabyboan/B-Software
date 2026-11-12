import { writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const capturedOn = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(capturedOn || '')) {
  throw new Error('Use npm run capture:nido -- YYYY-MM-DD');
}

const browser = await chromium.launch();
try {
  for (const [suffix, viewport] of [
    ['', { width: 1440, height: 1000 }],
    ['-mobile', { width: 390, height: 844 }],
  ]) {
    const page = await browser.newPage({ viewport, locale: 'es-AR', colorScheme: 'light', deviceScaleFactor: 1 });
    await page.goto('https://inmobiliaria-app.pages.dev/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'No, gracias', exact: true }).click();
    await page.mouse.move(0, 0);
    // Flutter paints its canvas and loads property photos after the HTML is ready.
    await page.waitForTimeout(6000);
    const screenshot = await page.screenshot();
    const webp = await sharp(screenshot).webp({ quality: 86 }).toBuffer();
    const filename = `nido-inmobiliaria-${capturedOn}${suffix}.webp`;
    await writeFile(new URL(`../public/${filename}`, import.meta.url), webp);
    console.log(`${filename}: ${viewport.width}x${viewport.height}, ${webp.length} bytes, ${page.url()}`);
    await page.close();
  }
} finally {
  await browser.close();
}
