import { injectStyle } from '/js/utils/styleLoader.js';
injectStyle('/components/bottom-bar/bottom-bar.css');

const items = [
  {
    label: 'Explore',
    href: '/',
    icon: 'bi bi-compass',
  },
  {
    label: 'Groups',
    href: '/groups',
    icon: 'bi bi-people',
  },
  {
    label: 'Chat',
    href: '/chat',
    icon: 'bi bi-chat-dots',
  },
  {
    label: 'Profil',
    href: '/profile',
    icon: 'bi bi-person',
  },
];

export function BottomBar() {
  const el = document.createElement('nav');
  el.className = 'bottom-bar';
  el.setAttribute('aria-label', 'Navigasi bawah');

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

  const isAuthRoute = () => ['/login', '/signup'].includes(window.location.pathname.replace(/\/$/, '') || '/');

  const setActive = () => {
    const path = window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, '');
    el.querySelectorAll('.bottom-bar__item').forEach((item) => {
      item.classList.toggle('is-active', item.getAttribute('href') === path);
    });
    el.style.display = isAuthRoute() ? 'none' : '';
  };

  setActive();
  window.addEventListener('route-change', setActive);

  return el;
}
