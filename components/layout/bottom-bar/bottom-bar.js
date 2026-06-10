import { injectStyle } from '../../../js/utils/styleLoader.js';
import { getHashPath } from '../../../js/utils/url.js';
import { isAuthenticated } from '../../../js/services/auth.js';
injectStyle('/components/layout/bottom-bar/bottom-bar.css');

function getItems() {
  const authed = isAuthenticated();
  return [
    { label: 'Jelajahi', href: '/', icon: 'bi bi-compass' },
    { label: 'Forum', href: '/forums', icon: 'bi bi-chat-square-text' },
    { label: 'Grup', href: '/groups', icon: 'bi bi-people' },
    ...(authed ? [{ label: 'Pesan', href: '/chat', icon: 'bi bi-chat-dots' }] : []),
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
      const href = item.getAttribute('href');
      const isGroupsRoute = href === '/groups' && (path === '/groups' || path === '/groups-interior');
      item.classList.toggle('is-active', href === path || isGroupsRoute);
    });
    el.style.display = isAuthRoute() ? 'none' : '';
  };

  render();
  window.addEventListener('route-change', () => { render(); setActive(); });

  return el;
}
