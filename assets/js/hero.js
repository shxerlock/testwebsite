/* Hero lens. A magnifying glass follows the pointer across the hero and, inside
   the circle, the page flips to an "x-ray" view (a second, inverted copy of the
   title, clipped to the lens). Before the first mouse move, and on touch
   screens, the lens drifts along a slow path by itself so the effect is seen.
   It pauses when the hero is off screen or the tab is hidden, and it is not
   built at all under prefers-reduced-motion. */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

export function initHero() {
  const hero = document.querySelector('header.hero-home');
  const xray = hero && hero.querySelector('.hero-xray');
  const ring = hero && hero.querySelector('.lens-ring');
  if (!hero || !xray || !ring || reduceMotion.matches) return;

  const RING = 300;          /* ring element is 300px; scaled to the lens radius */
  let w = 1;
  let h = 1;
  let x = 0;
  let y = 0;
  let r = 0;
  let tx = 0;
  let ty = 0;
  let tr = 0;
  let manual = false;        /* true once a real mouse has taken over */
  let hovering = false;
  let raf = 0;
  let onScreen = true;

  const radius = () => Math.max(66, Math.min(150, w * 0.17));

  function measure() {
    const rect = hero.getBoundingClientRect();
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
  }

  function autopilot(t) {
    /* a slow figure-of-eight across the title area */
    const s = t / 1000;
    tx = w * (0.34 + 0.2 * Math.sin(s * 0.55));
    ty = Math.min(h * 0.42, 330) * (0.82 + 0.22 * Math.sin(s * 0.8 + 1.2)) + 120;
    tr = radius();
  }

  function frame(now) {
    raf = 0;
    if (!manual) autopilot(now);
    else tr = hovering ? radius() : 0;

    x += (tx - x) * 0.16;
    y += (ty - y) * 0.16;
    r += (tr - r) * 0.14;

    xray.style.setProperty('--lx', `${x.toFixed(1)}px`);
    xray.style.setProperty('--ly', `${y.toFixed(1)}px`);
    xray.style.setProperty('--lr', `${Math.max(r, 0).toFixed(1)}px`);
    ring.style.transform = `translate3d(${(x - RING / 2).toFixed(1)}px, ${(y - RING / 2).toFixed(1)}px, 0) scale(${(Math.max(r, 0) / (RING / 2)).toFixed(3)})`;
    ring.style.opacity = r > 2 ? '1' : '0';

    const settled = manual && Math.abs(tx - x) < 0.3 && Math.abs(ty - y) < 0.3 && Math.abs(tr - r) < 0.3;
    if (onScreen && !document.hidden && !settled) raf = window.requestAnimationFrame(frame);
  }

  function wake() {
    if (!raf && onScreen && !document.hidden) raf = window.requestAnimationFrame(frame);
  }

  measure();
  x = tx = w * 0.3;
  y = ty = 220;
  new ResizeObserver(measure).observe(hero);

  if (finePointer.matches) {
    hero.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const rect = hero.getBoundingClientRect();
      if (!manual) { manual = true; x = event.clientX - rect.left; y = event.clientY - rect.top; }
      tx = event.clientX - rect.left;
      ty = event.clientY - rect.top;
      hovering = true;
      wake();
    }, { passive: true });

    hero.addEventListener('pointerleave', () => {
      hovering = false;
      wake();
    });
  }

  new IntersectionObserver((entries) => {
    onScreen = entries[0].isIntersecting;
    if (onScreen) wake();
  }).observe(hero);

  document.addEventListener('visibilitychange', wake);
  wake();
}
