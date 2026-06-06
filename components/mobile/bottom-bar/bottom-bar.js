const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '/components/mobile/bottom-bar/bottom-bar.css';
document.head.appendChild(link);

const items = [
  {
    label: 'Explore',
    href: '/',
    icon: '<i class="bi bi-compass"></i>',
  },
  {
    label: 'Groups',
    href: '/groups',
    icon: '<i class="bi bi-people"></i>',
  },
  {
    label: 'Chat',
    href: '/chat',
    icon: '<i class="bi bi-chat-dots"></i>',
  },
  {
    label: 'Profil',
    href: '/profile',
    icon: '<i class="bi bi-person"></i>',
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
          ${item.icon}
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
