/* Paper / night toggle. Paper is the default; night is data-theme="dark".
   Where the browser supports View Transitions, the new theme is painted as a
   circle that grows out of the toggle button. */

const STORAGE_KEY = 'sherlock-theme';
const META_PAPER = '#efe9dc';
const META_NIGHT = '#12110e';

function isDark() {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

function applyTheme(dark, button) {
  if (dark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  button.setAttribute('aria-pressed', String(dark));
  button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? META_NIGHT : META_PAPER);

  try {
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  } catch (e) {
    /* the theme still applies for this visit */
  }
}

function switchTheme(dark, button) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || typeof document.startViewTransition !== 'function') {
    applyTheme(dark, button);
    return;
  }

  const rect = button.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  const root = document.documentElement;
  root.classList.add('theme-vt');

  const transition = document.startViewTransition(() => applyTheme(dark, button));
  transition.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 650, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
    );
  }).catch(() => { /* the theme has already been applied */ });
  transition.finished.finally(() => root.classList.remove('theme-vt'));
}

export function initTheme() {
  const button = document.getElementById('themeToggle');
  if (!button) return;

  applyTheme(isDark(), button);
  button.addEventListener('click', () => switchTheme(!isDark(), button));
}
