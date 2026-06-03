const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '/components/mobile/bottom-bar/bottom-bar.css';
document.head.appendChild(link);

const items = [
  {
    label: 'Explore',
    href: '#/',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3l7 7-7 11-7-11 7-7z"></path>
      </svg>
    `,
  },
  {
    label: 'Groups',
    href: '#/groups',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path>
        <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    `,
  },
  {
    label: 'Chat',
    href: '#/chat',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
      </svg>
    `,
  },
  {
    label: 'Profil',
    href: '#/profile',
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
    const hash = window.location.hash || '#/';
    el.querySelectorAll('.bottom-bar__item').forEach((item) => {
      item.classList.toggle('is-active', item.getAttribute('href') === hash);
    });
  };

  setActive();
  window.addEventListener('hashchange', setActive);

  return el;
}
