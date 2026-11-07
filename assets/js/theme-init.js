/* Runs before first paint so a saved choice never flashes the wrong theme.
   Paper (light) is the default; "night" is data-theme="dark". With no saved
   choice the visitor's system preference decides. Also marks the page as
   script-enabled so the hero can show its first sentence without JavaScript. */
(function () {
  document.documentElement.classList.add('js');
  try {
    var saved = localStorage.getItem('sherlock-theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (saved !== 'light' && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {
    /* blocked site data: the paper default is correct anyway */
  }
})();
