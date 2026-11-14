import { englishTranslations } from "../i18n/translations";

type Language = "es" | "en";
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

function setLanguage(next: Language, persist = true) {
  const scrollPosition = persist ? scrollY : 0;
  language = next;
  document.documentElement.lang = next === "en" ? "en" : "es-AR";
  document.documentElement.dataset.language = next;
  if (persist) {
    try { localStorage.setItem("bsoftware-language", next); } catch { /* Browsing remains usable when storage is blocked. */ }
  }
  if (language === "en" || hasTranslated) apply(document.documentElement);
  if (language === "en") hasTranslated = true;
  document.querySelectorAll<HTMLButtonElement>("[data-language-option]").forEach((button) => {
    const active = button.dataset.languageOption === next;
    button.setAttribute("aria-pressed", String(active));
    button.classList.toggle("active", active);
  });
  document.dispatchEvent(new CustomEvent("bsoftware:language", { detail: next }));
  // Translation and gallery measurement must not scroll the reader elsewhere.
  if (persist) window.scrollTo({ top: scrollPosition, behavior: 'instant' });
}

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest<HTMLElement>("[data-language-option]");
  const next = button?.dataset.languageOption;
  if (next === "es" || next === "en") setLanguage(next);
});

setLanguage(language, false);
new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === "characterData") applyText(mutation.target);
    mutation.addedNodes.forEach(apply);
  }
}).observe(document.body, { childList: true, subtree: true, characterData: true });
