export function getHashPath() {
  return window.location.hash.replace('#', '').split('?')[0] || '/';
}

export function getHashParams() {
  const hash = window.location.hash;
  const queryString = hash.includes('?') ? hash.split('?')[1] : '';
  return new URLSearchParams(queryString);
}

export function navigateTo(path) {
  window.location.hash = path;
}

export function asset(path) {
  return `${window.BASE}${path}`;
}
