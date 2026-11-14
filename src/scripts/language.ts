export {};

type Language = "es" | "en";
let englishTranslations: Record<string, string> = {};
let dictionary: Promise<void> | undefined;
let request = 0;
function loadEnglish() {
  return dictionary ??= import('../i18n/translations').then(module => {
    englishTranslations = module.englishTranslations;
  }).catch(error => {
    dictionary = undefined;
    throw error;
  });
}
const texts = new WeakMap<Node, { source: string; translated: string }>();
const attributes = new WeakMap<Element, Map<string, { source: string; translated: string }>>();
const names = ["alt", "aria-label", "aria-description", "placeholder", "title"];
const attributeSelector = names.map(name => `[${name}]`).join(',') + ',meta[name="description"],meta[property^="og:"],meta[name^="twitter:"]';
const excluded = "script, style, noscript, code, pre, [data-no-translate]";
const translate = (source: string, language: Language) => {
  const key = source.trim();
  return language === "en" && englishTranslations[key]
    ? source.replace(key, englishTranslations[key]) : source;
};
let language: Language = document.documentElement.dataset.language === "en" ? "en" : "es";
let hasTranslated = false;

function applyText(node: Node) {
  if (language === "es" && !texts.has(node)) return;
  if (node.parentElement?.closest(excluded)) return;
  const current = node.nodeValue || "";
  const previous = texts.get(node);
  const source = previous && (current === previous.source || current === previous.translated)
    ? previous.source : current;
  const translated = translate(source, language);
  texts.set(node, { source, translated });
  if (current !== translated) node.nodeValue = translated;
}

function applyAttributes(element: Element) {
  if (element.closest(excluded)) return;
  const origins = attributes.get(element) || new Map();
  attributes.set(element, origins);
  for (const name of element.matches('meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]') ? [...names, "content"] : names) {
    if (!element.hasAttribute(name)) continue;
    const current = element.getAttribute(name) || "";
    const previous = origins.get(name);
    const source = previous && (current === previous.source || current === previous.translated) ? previous.source : current;
    const translated = translate(source, language);
    origins.set(name, { source, translated });
    if (current !== translated) element.setAttribute(name, translated);
  }
}

function apply(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) { applyText(root); return; }
  if (root instanceof Element) {
    if (root.closest(excluded)) return;
    applyAttributes(root);
    root.querySelectorAll(attributeSelector).forEach(applyAttributes);
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) applyText(walker.currentNode);
}

async function setLanguage(next: Language, persist = true) {
  const current = ++request;
  if (next === 'es') document.querySelector('[data-language-option="en"]')?.removeAttribute('aria-busy');
  if (persist && next === language && (next === 'es' || hasTranslated)) {
    try { localStorage.setItem('bsoftware-language', next); } catch {}
    return;
  }
  if (next === 'en') {
    const button = document.querySelector('[data-language-option="en"]');
    button?.setAttribute('aria-busy', 'true');
    try { await loadEnglish(); }
    catch {
      if (current === request && !hasTranslated) void setLanguage('es', false);
      return;
    } // Keep the current readable language if the network fails.
    finally { if (current === request) button?.removeAttribute('aria-busy'); }
    if (current !== request) return;
  }
  language = next;
  document.documentElement.lang = next === "en" ? "en" : "es-AR";
  document.documentElement.dataset.language = next;
  if (persist) {
    try { localStorage.setItem("bsoftware-language", next); } catch { /* Browsing remains usable when storage is blocked. */ }
  }
  // Do not observe our own text replacements and translate them a second time.
  observer.disconnect();
  if (language === "en" || hasTranslated) apply(document.documentElement);
  observe();
  if (language === "en") hasTranslated = true;
  document.querySelectorAll<HTMLButtonElement>("[data-language-option]").forEach((button) => {
    const active = button.dataset.languageOption === next;
    button.setAttribute("aria-pressed", String(active));
    button.classList.toggle("active", active);
  });
  document.dispatchEvent(new CustomEvent("bsoftware:language", { detail: next }));
  // Home disables scroll anchoring; the desktop gallery preserves its position
  // when it measures. Calling scrollTo here would force a full layout mid-click.
}

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest<HTMLElement>("[data-language-option]");
  const next = button?.dataset.languageOption;
  if (next === "es" || next === "en") setLanguage(next);
});

// Warm the optional dictionary when the reader approaches the language control.
for (const event of ['pointerover', 'focusin']) {
  document.querySelector('[data-language-option="en"]')?.addEventListener(event, () => {
    void loadEnglish().catch(() => {});
  }, { once: true });
}

const observer = new MutationObserver((mutations) => {
  observer.disconnect();
  try {
    for (const mutation of mutations) {
      if (mutation.type === "characterData") applyText(mutation.target);
      mutation.addedNodes.forEach(apply);
    }
  } finally { observe(); }
});
function observe() {
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}
setLanguage(language, false);
