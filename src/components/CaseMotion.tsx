import { useEffect, useRef, type ReactNode } from 'react';
import '../styles/case-motion.css';

/** Progressive enhancement: the server renders every case and link without JS. */
export default function CaseMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const cards = Array.from(element.querySelectorAll<HTMLElement>('.case-list > article'));
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(min-width: 1100px) and (min-height: 850px)');
    let frame = 0;
    const update = () => {
      frame = 0;
      cards.forEach(card => {
        // Tall cards stay in normal flow so no text or links become unreachable.
        const sticky = desktop.matches && !preference.matches && card.offsetHeight < innerHeight - 160;
        card.classList.toggle('case-stacks', sticky);
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('case-in-view', entry.isIntersecting));
    }, { threshold: 0.12 });
    cards.forEach((card, index) => {
      card.style.setProperty('--case-index', String(index));
      observer.observe(card);
    });
    const resize = new ResizeObserver(schedule);
    cards.forEach(card => resize.observe(card));
    preference.addEventListener('change', schedule);
    desktop.addEventListener('change', schedule);
    window.addEventListener('resize', schedule, { passive: true });
    element.classList.add('motion-ready');
    update();
    return () => {
      observer.disconnect();
      resize.disconnect();
      cancelAnimationFrame(frame);
      preference.removeEventListener('change', schedule);
      desktop.removeEventListener('change', schedule);
      window.removeEventListener('resize', schedule);
      element.classList.remove('motion-ready');
      cards.forEach(card => card.classList.remove('case-stacks', 'case-in-view'));
    };
  }, []);

  return <div ref={root} className="case-motion">{children}</div>;
}
