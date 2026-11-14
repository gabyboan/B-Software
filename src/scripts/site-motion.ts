// Every element is visible in the server HTML. Animation is an enhancement only.
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const running = new Set<Animation>();
let observer: IntersectionObserver | undefined;

function animate(element: Element, frames: Keyframe[], delay = 0, duration = 720) {
  if (preference.matches) return;
  const animation = element.animate(frames, {
    duration, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards',
  });
  running.add(animation);
  animation.finished.catch(() => {}).finally(() => running.delete(animation));
}

function setup() {
  observer?.disconnect();
  running.forEach(animation => animation.cancel());
  running.clear();
  if (preference.matches || !('IntersectionObserver' in window)) return;

  document.querySelectorAll('.hero-copy > *, .hero-system').forEach((element, index) => {
    // Keep the LCP heading fully painted from the first frame.
    animate(element, [{ transform: 'translateY(22px)' }, { transform: 'translateY(0)' }], Math.min(index * 55, 250), 800);
  });

  const selector = '.home-heading, .problem-grid > article, .services-list > article, .method-list > li, .trust-list > article, .quote-grid > article, .about-strip > div, .project-evidence, .rrhh-heading, .contact-intro';
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer!.unobserve(entry.target);
      const siblings = Array.from(entry.target.parentElement?.children || []);
      const delay = Math.min(siblings.indexOf(entry.target) % 3, 2) * 65;
      animate(entry.target, [{ opacity: .25, transform: 'translateY(26px)' }, { opacity: 1, transform: 'translateY(0)' }], delay);
    });
  }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll(selector).forEach(element => observer!.observe(element));
}

preference.addEventListener('change', setup);
setup();

// One queued frame per scroll event; no perpetual JavaScript animation loop.
const progress = document.querySelector<HTMLElement>('[data-reading-progress]');
const header = document.querySelector('.site-header');
let frame = 0;
let maxScroll = 0;
let documentHeight = 0;
function paint() {
  frame = 0;
  const position = scrollY;
  progress?.style.setProperty('--reading-progress', String(maxScroll > 0 ? Math.min(1, Math.max(0, position / maxScroll)) : 0));
  header?.classList.toggle('is-scrolled', position > 24);
}
function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
addEventListener('scroll', schedule, { passive: true });
// ResizeObserver runs after layout. Cache the range here instead of forcing an
// initial layout after entrance animations or rereading the height every scroll.
new ResizeObserver(() => {
  documentHeight = document.documentElement.scrollHeight;
  maxScroll = Math.max(0, documentHeight - innerHeight);
  schedule();
}).observe(document.body);
addEventListener('resize', () => {
  maxScroll = Math.max(0, documentHeight - innerHeight);
  schedule();
}, { passive: true });
