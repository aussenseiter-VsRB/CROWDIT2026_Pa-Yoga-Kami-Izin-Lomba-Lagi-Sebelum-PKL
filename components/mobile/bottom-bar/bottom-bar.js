const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '/components/mobile/bottom-bar/bottom-bar.css';
document.head.appendChild(link);

const items = [
  {
    label: 'Explore',
    href: '/',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3l7 7-7 11-7-11 7-7z"></path>
        <path d="M12 10l3 2-3 2-3-2 3-2z"></path>
      </svg>
    `,
  },
  {
    label: 'Groups',
    href: '/groups',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
        <path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
        <path d="M5 20v-1a3 3 0 0 1 3-3h0"></path>
        <path d="M19 20v-1a3 3 0 0 0-3-3h0"></path>
      </svg>
    `,
  },
  {
    label: 'Chat',
    href: '/chat',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 14a4 4 0 0 1-4 4H9l-5 3v-3.8A4 4 0 0 1 3 14V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
        <path d="M8 10h8"></path>
      </svg>
    `,
  },
  {
    label: 'Profil',
    href: '/profile',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 21a8 8 0 0 0-16 0"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    `,
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

  const setActive = () => {
    const path = window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, '');
    el.querySelectorAll('.bottom-bar__item').forEach((item) => {
      item.classList.toggle('is-active', item.getAttribute('href') === path);
    });
  };

  setActive();
  window.addEventListener('popstate', setActive);

  return el;
}
