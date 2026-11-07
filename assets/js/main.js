import { initTheme } from './theme.js';
import { initNav } from './nav.js';
import { initScrollProgress } from './scroll-progress.js';
import { initContactForm } from './contact.js';
import { initFlasher } from './flasher.js';
import { initKaliCmd } from './kalicmd.js';
import { initTyping } from './typing.js';
import { initShowcase } from './showcase.js';
import { initCarousels } from './carousel.js';
import { initKaliTools } from './kalitools.js';
import { initCyberSecurity } from './cybersecurity.js';
import { initHero } from './hero.js';
import { initReveal } from './reveal.js';

/* Every init no-ops when its section is absent, so the same entry point
   serves the home page, the Kali Tools page and the smaller legal pages.

   The motion layer (hero lens, reveal) is decoration only: it never gates
   content, it pauses when it is off screen, and it stands down for
   prefers-reduced-motion. */
initTheme();
initNav();
initScrollProgress();
initContactForm();
initFlasher();
initKaliCmd();
initTyping();
initShowcase();
initCarousels();
initKaliTools();
initCyberSecurity();

initHero();
initReveal();

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
