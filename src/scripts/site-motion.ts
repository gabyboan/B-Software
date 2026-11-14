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
let frame = 0;
function paint() {
  frame = 0;
  const max = document.documentElement.scrollHeight - innerHeight;
  progress?.style.setProperty('--reading-progress', String(max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0));
  document.querySelector('.site-header')?.classList.toggle('is-scrolled', scrollY > 24);
}
function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule, { passive: true });
new ResizeObserver(schedule).observe(document.body);
paint();
