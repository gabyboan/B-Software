import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/contacto/", "/sobre-b-software/", "/proyectos/gestion-recursos-humanos/", "/proyectos/comparador-geolocalizado-de-precios/", "/proyectos/nido-inmobiliaria/", "/privacidad/", "/terminos/", "/cookies/"];

for (const route of routes) {
  test(`route, assets, accessibility and layout: ${route}`, async ({ page }) => {
    const failures: string[] = [];
    page.on("pageerror", error => failures.push(error.message));
    page.on("response", response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
    const response = await page.goto(route + "?lang=es");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", "es-AR");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toBe(`https://bsoftware.pages.dev${route}`);
    for (const script of await page.locator('script[type="application/ld+json"]').allTextContents()) expect(() => JSON.parse(script)).not.toThrow();
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target:n.target, reason:n.failureSummary })) }))).toEqual([]);
    expect(failures).toEqual([]);
  });
}

test("language switch restores source text after dynamic tabs and navigation", async ({ page }) => {
  await page.goto("/?lang=es");
  await page.getByRole("button", { name:"View site in English", exact:true }).click();
  await expect(page.locator("h1")).toHaveText("Custom software to work better.");
  await page.getByRole("tab", { name:"Cloudflare", exact:true }).click();
  await expect(page.locator("[data-tech-output-role]")).toHaveText("Delivery and services");
  await page.locator('[data-language-option="es"]').click();
  await expect(page.locator("[data-tech-output-role]")).toHaveText("Entrega y servicios");
  await page.locator('[data-language-option="en"]').click();
  await page.goto("/contacto/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("h1")).toHaveText("Tell me what you need to solve.");
});

test("blocked storage does not break language or contact", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } });
  });
  const failures: string[] = [];
  page.on("pageerror", error => failures.push(error.message));
  await page.goto("/contacto/?lang=en");
  await expect(page.locator("h1")).toHaveText("Tell me what you need to solve.");
  await page.locator('[data-language-option="es"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "es-AR");
  await expect(page.locator('button[type="submit"]')).toBeEnabled();
  expect(failures).toEqual([]);
});

test("contact rejects invalid input and prepares the WhatsApp draft without sending", async ({ page }) => {
  await page.goto("/contacto/?lang=es");
  await page.evaluate(() => { (window as any).__opened = []; window.open = ((url: string) => { (window as any).__opened.push(url); return null; }) as typeof window.open; });
  await page.locator('input[name="name"]').fill("   ");
  await page.locator('input[name="contact"]').fill("invalid");
  await page.locator('textarea[name="need"]').fill("                      ");
  await page.locator('button[type="submit"]').click();
  await expect(page.locator("[data-form-status]")).toContainText("Revisá");
  expect(await page.evaluate(() => (window as any).__opened)).toEqual([]);
  await page.locator('input[name="name"]').fill("Persona Demo");
  await page.locator('input[name="contact"]').fill("demo@example.com");
  await page.locator('textarea[name="need"]').fill("Necesito ordenar informes y planillas de mi equipo.");
  await page.locator('button[type="submit"]').click();
  const link = await page.locator("[data-whatsapp-fallback]").getAttribute("href");
  const draft = new URL(link!);
  expect(draft.origin + draft.pathname).toBe("https://wa.me/5493434064408");
  expect(draft.searchParams.get("text")).toContain("Nombre: Persona Demo");
  expect(draft.searchParams.get("text")).toContain("demo@example.com");
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  await expect(page.locator("[data-whatsapp-fallback]")).toBeVisible();
});

test("navigation closes on mobile and diagram supports keyboard reset", async ({ page, isMobile }) => {
  await page.goto("/?lang=es");
  if (isMobile) {
    await page.locator(".mobile-nav summary").click();
    await page.locator('.mobile-nav a[href="/#proyectos"]').click();
    await expect(page.locator(".mobile-nav")).not.toHaveAttribute("open", "");
  }
  await page.goto("/proyectos/gestion-recursos-humanos/?lang=es");
  const node = page.locator('[data-node="gestion"]');
  const initial = await node.evaluate(element => (element as HTMLElement).style.left);
  await node.focus();
  await page.keyboard.press("ArrowRight");
  expect(await node.evaluate(element => (element as HTMLElement).style.left)).not.toBe(initial);
  await page.locator("#resetLayout").click();
  expect(await node.evaluate(element => (element as HTMLElement).style.left)).toBe(initial);
});

test("missing pages return a real 404", async ({ page }) => {
  const response = await page.goto("/pagina-inexistente-de-verificacion/");
  expect(response?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
});

test("without JavaScript the form cannot expose a query in the URL", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled:false });
  const page = await context.newPage();
  await page.goto(baseURL + "/contacto/");
  await expect(page.locator('button[type="submit"]')).toBeDisabled();
  await expect(page.locator('noscript a[href="mailto:gabrielboan14@gmail.com"]')).toBeVisible();
  await context.close();
});

test("every internal link and fragment has a real destination", async ({ page, request, baseURL }) => {
  const seen = new Set<string>();
  for (const route of routes) {
    await page.goto(route + "?lang=es");
    const links = await page.locator("a[href]").evaluateAll(anchors => anchors.map(a => (a as HTMLAnchorElement).href));
    for (const link of links) {
      const url = new URL(link);
      if (url.origin !== new URL(baseURL!).origin || seen.has(url.href)) continue;
      seen.add(url.href);
      const result = await request.get(url.href);
      expect(result.status(), url.href).toBe(200);
      if (url.hash) expect(await result.text(), url.href).toContain(`id="${decodeURIComponent(url.hash.slice(1))}"`);
    }
  }
});
