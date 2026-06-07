import { injectStyle } from '../../js/utils/styleLoader.js';
import { getHashPath } from '../../js/utils/url.js';
import { isAuthenticated } from '../../js/auth.js';
injectStyle('/components/bottom-bar/bottom-bar.css');

function getItems() {
  const authed = isAuthenticated();
  return [
    { label: 'Explore', href: '/', icon: 'bi bi-compass' },
    { label: 'Groups', href: '/groups', icon: 'bi bi-people' },
    ...(authed ? [{ label: 'Chat', href: '/chat', icon: 'bi bi-chat-dots' }] : []),
    ...(authed ? [{ label: 'Profil', href: '/profile', icon: 'bi bi-person' }] : []),
  ];
}

export function BottomBar() {
  const el = document.createElement('nav');
  el.className = 'bottom-bar';
  el.setAttribute('aria-label', 'Navigasi bawah');

  function render() {
    const items = getItems();
    el.innerHTML = `
      <div class="bottom-bar__shell">
        ${items.map((item) => `
          <a class="bottom-bar__item" href="${item.href}" data-link data-route="${item.href}">
            <i class="${item.icon}"></i>
            <span>${item.label}</span>
          </a>
        `).join('')}
      </div>
    `;
    setActive();
  }

  const isAuthRoute = () => ['/login', '/signup'].includes(getHashPath());

  const setActive = () => {
    const path = getHashPath();
    el.querySelectorAll('.bottom-bar__item').forEach((item) => {
      item.classList.toggle('is-active', item.getAttribute('href') === path);
    });
    el.style.display = isAuthRoute() ? 'none' : '';
  };

  render();
  window.addEventListener('route-change', () => { render(); setActive(); });

  return el;
}
