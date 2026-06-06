const THEME_KEY = 'studnow_theme';

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

export function setTheme(mode) {
  const m = mode === 'dark' ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, m);
  document.documentElement.setAttribute('data-theme', m);
  window.dispatchEvent(new CustomEvent('theme-change', { detail: m }));
}

export function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

export function initTheme() {
  const saved = getTheme();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved !== 'light' && saved !== 'dark'
    ? (prefersDark ? 'dark' : 'light')
    : saved;
  document.documentElement.setAttribute('data-theme', theme);
  if (theme !== saved) {
    localStorage.setItem(THEME_KEY, theme);
  }
  return theme;
}
